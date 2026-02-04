import * as ArkhamDB from "@/components/arkhamDB";
import * as ArkhamCards from "@/components/arkhamCards";
import { groupBy, prop, propEq, toPairs } from "ramda";
import { showError } from "@/util/console";
import { isIconIgnored, withIconSynonyms } from "./criteria";

const SPECIAL_GROUP_NAMES = ["Epic Multiplayer", "Single Group"];

export const getEncounterSets = async () => {
  console.log("loading Arkham Cards encounter sets...");
  const arkhamCardsEncounters = await ArkhamCards.getEncounterSets();

  console.log("loading ArkhamDB encounter sets...");
  const arkhamDBEncounters = await ArkhamDB.getEncounterSets();

  const specialGroups = toPairs(groupBy(prop("name"), arkhamDBEncounters))
    .map(([name, group = []]) => {
      return {
        name,
        group,
      };
    })
    .filter(({ group, name }) => {
      if (!SPECIAL_GROUP_NAMES.includes(name)) {
        return false;
      }
      return group.length > 1;
    });

  // const specialNames = specialGroups.map(prop('name'));

  // console.log(`found special groups: ${specialNames.join(", ")}...`);

  const prepareText = (text: string) => text.trim().toLowerCase();

  const matches = arkhamDBEncounters.map((encounter) => {
    const specialGroup = specialGroups.find(propEq(encounter.name, "name"));
    if (specialGroup) {
      const synonyms = [
        ...encounter.synonyms,
        ...specialGroup.group
          .map(prop("code"))
          .filter((code) => code !== encounter.code),
      ].filter(isIconIgnored);

      return {
        ...encounter,
        synonyms,
      };
    }

    const arkhamCardsEncounter = arkhamCardsEncounters.find(
      ({ name }) => prepareText(encounter.name) === prepareText(name)
    );

    if (!arkhamCardsEncounter) {
      showError(`Arkham Cards encounter not found: ${encounter.code}`);

      return encounter;
    }

    if (encounter.code === arkhamCardsEncounter.code) {
      return encounter;
    }

    console.log(
      `found encounter code difference: ${encounter.code}/${arkhamCardsEncounter.code}`
    );

    return {
      ...encounter,
      synonyms: [...encounter.synonyms, arkhamCardsEncounter.code],
    };
  });

  const restArkhamCards = arkhamCardsEncounters.filter(({ code }) => {
    if (SPECIAL_GROUP_NAMES.includes(code)) {
      return false;
    }
    return !arkhamDBEncounters.some(withIconSynonyms(code));
  });

  return [...matches, ...restArkhamCards];
};
