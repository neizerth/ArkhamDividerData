import { IDatabase } from '@/types/database';
import * as ArkhamCards from '@/components/arkhamCards/database'
import * as ArkhamDB from '@/components/arkhamDB/database';
import { groupBy, isNotNil, mergeAll, prop, values } from 'ramda';

/*
  pack_code and cycle_code linking to encounter sets
  ArkhamDB: just find right PackEncounterSets entities
  ArkhamCards: append rest of data and exclude encounters with already set pack_code
*/
export const getEncounterSets = (): IDatabase.EncounterSet[] => {
  const data = [];

  console.log('caching Arkham Cards database encounter sets...');
  data.push(...ArkhamCards.getEncounterSets());

  console.log('caching ArkhamDB database encounter sets...');
  data.push(...ArkhamDB.getEncounterSets());

  const groups = groupBy(prop('code'), data);

  const groupValues = values(groups).filter(isNotNil);
  return groupValues.map(mergeAll) as IDatabase.EncounterSet[];
}