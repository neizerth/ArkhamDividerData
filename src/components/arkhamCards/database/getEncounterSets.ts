import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { whereSynonyms } from "@/util/criteria";
import { groupBy, isNotNil, prop, propEq, values } from "ramda";
import { createIconDB } from "../icons/IconDB";
import { toSynonyms } from "@/util/common";
import { showError } from "@/util/console";

export const getEncounterSets = (): IDatabase.EncounterSet[] => {
  const scenarioEncounters = Cache.getScenarioEncounterSets();
  const encounters = Cache.getEncounterSets();

  const mainScenarioEncounters = scenarioEncounters.filter(
    propEq(false, 'is_extra')
  );

  const iconDB = createIconDB();

  const databaseEncounters = mainScenarioEncounters.map(({
    cycle_code,
    encounter_set_code,
    pack_code,
    is_canonical,
    is_official
  }): IDatabase.EncounterSet => {
    
    const icon = iconDB.getIcon(encounter_set_code);

    const encounterData = {
      code: encounter_set_code,
      cycle_code,
      pack_code,
      is_canonical,
      is_official,
      icon
    };
    
    const encounter = encounters.find(whereSynonyms(encounter_set_code));

    if (!encounter) {
      showError(`encounter not found: ${encounter_set_code}`);
      return {
        ...encounterData,
        name: encounter_set_code,
        synonyms: []
      };
    }

    const { name, synonyms } = encounter;
    const encounterIcon = icon || iconDB.getIconOf(
      toSynonyms(encounter)
    )

    return {
      ...encounterData,
      name,
      icon: encounterIcon,
      synonyms
    }
  });

  return values(
      groupBy(
        prop('code'), 
        databaseEncounters
      )
    )
    .map((group = []) => group[0])
    .filter(isNotNil);
}