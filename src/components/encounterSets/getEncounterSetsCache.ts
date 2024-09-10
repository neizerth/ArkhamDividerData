import { loadEncounterSets } from "@/api/arkhamCards/api";
import { IArkhamCards } from "@/types/arkhamCards";
import { getCustomPacksFromCache } from "@/util/cache";
import { prop, propEq } from "ramda";

export const getEncounterSetsCache = async () => {
  const encounterSets = await loadEncounterSets('en');

  const packs = getCustomPacksFromCache();
  const packEncounterSets = packs.map(prop('encounter_sets')).flat()

  return Object.entries(encounterSets).map(
    ([code, name]): IArkhamCards.EncounterSet => {
      const packEncounterSet = packEncounterSets.find(propEq(code, 'code'));

      if (!packEncounterSet) {
        return {
          code,
          name
        }
      }

      const { size } = packEncounterSet;

      return {
        code,
        name,
        size
      }
    });
}