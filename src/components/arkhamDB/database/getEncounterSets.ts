import { createIconDB } from '@/components/arkhamCards/icons/IconDB';
import type { IDatabase } from '@/types/database';
import * as Cache from '@/util/cache';
import { toSynonyms } from '@/util/common';
import { showError } from '@/util/console';
import { whereSynonyms } from '@/util/criteria';

export const getEncounterSets = (): IDatabase.EncounterSet[] => {
  const encounterSets = Cache.getEncounterSets();
  const packEncounterSets = Cache.getPackEncounterSets();
  const iconDB = createIconDB();
  
  return packEncounterSets.map((packEncounterSet): IDatabase.EncounterSet => {
    const {
      cycle_code,
      pack_code,
      encounter_set_code,
      types,
      size
    } = packEncounterSet;

    const encounter = {
      code: encounter_set_code,
      cycle_code,
      pack_code,
      size,
      types,
      is_canonical: true,
      is_official: true,
      synonyms: []
    };

    const encounterSet = encounterSets.find(whereSynonyms(encounter_set_code));

    if (!encounterSet) {
      showError(`encounter set not found: ${encounter_set_code}`);
      return {
        ...encounter,
        name: encounter_set_code,
      };
    }
    
    const { name, synonyms } = encounterSet;
    const codes = toSynonyms(encounterSet);

    const icon = iconDB.getIconOf(codes);

    return {
      ...encounter,
      icon,
      name,
      synonyms
    }
  })
}