import { IDatabase } from '@/types/database';
import * as ArkhamCards from '@/components/arkhamCards/database'
import * as ArkhamDB from '@/components/arkhamDB/database';

/*
  pack_code and cycle_code linking to encounter sets
  ArkhamDB: just find right PackEncounterSets entities
  ArkhamCards: append rest of data and exclude encounters with already set pack_code
*/
export const getEncounterSets = (): IDatabase.EncounterSet[] => {
  const data = [];
  console.log('caching ArkhamDB database encounter sets...');
  data.push(...ArkhamDB.getEncounterSets());

  console.log('caching Arkham Cards database encounter sets...');
  data.push(...ArkhamCards.getEncounterSets());

  return data;
}