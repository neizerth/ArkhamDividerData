import * as Cache from '@/util/cache';
import * as ArkhamCards from '@/api/arkhamCards/api';
import { propEq, toPairs } from 'ramda';
import { showError } from '@/util/console';
import type { Mapping } from '@/types/common';

export const getEncounterSetTranslations = async (language: string) => {
  const dbEncounters = Cache.getDatabaseEncounterSets();
  const encounters = await ArkhamCards.loadEncounterSets(language);

  return toPairs(encounters)
    .reduce((target, [code, value]) => {
        const dbEncounter = dbEncounters.find(propEq(code, 'code'));
        if (!dbEncounter) {
          showError(`encounter not found: ${code}`);
          return target;
        }
        const { name } = dbEncounter;
        if (value === name) {
          return target;
        }
        target[name] = value;
        return target;
      }, 
      {} as Mapping
    );
}