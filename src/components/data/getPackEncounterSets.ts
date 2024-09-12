import * as ArkhamDB from '@/components/arkhamDB';
import { ICache } from '@/types/cache';

/*
  Gets encounter sets per pack
  Due to Arkham Cards hasn't all encounters we can't take this data 
*/
export const getPackEncounterSets = async (): Promise<ICache.PackEncounterSet[]> => {
  const data = [];

  console.log('loading ArkhamDB pack encounter sets...');
  data.push(...await ArkhamDB.getPackEncounterSets());
  
  return data;
}
