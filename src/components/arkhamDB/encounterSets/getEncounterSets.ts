import * as API from '@/api/arkhamDB/api';
import { ICache } from '@/types/cache';

export const getEncounterSets = async (): Promise<ICache.EncounterSet[]> => {
  const data = await API.loadJSONEncounters();
  return data.map(encounter => ({
    ...encounter,
    synonyms: []
  }))
}