import * as ArkhamDB from '@/components/arkhamDB';
import * as ArkhamCards from '@/components/arkhamCards';
import { ICache } from '@/types/cache';
import packEncounterSets from '@/data/packEncounterSets.json'

/*
  Gets encounter sets per pack
  Due to Arkham Cards hasn't all encounters we can't take this data 
*/
export const getPackEncounterSets = async (): Promise<ICache.PackEncounterSet[]> => {
  const data = [];

  console.log('loading ArkhamDB pack encounter sets...');
  data.push(...await ArkhamDB.getPackEncounterSets());

  console.log('loading Arkham Cards pack encounter sets...');
  data.push(...await ArkhamCards.getPackEncounterSets());

  console.log('loading extra pack encounter sets...');
  data.push(...getExtraPackEncounterSets());
  
  return data;
}

export const getExtraPackEncounterSets = (): ICache.PackEncounterSet[] => {
  return packEncounterSets.map(packEncounterSet => ({
    ...packEncounterSet,
    source: ICache.Source.ARKHAMDB
  }))
}
