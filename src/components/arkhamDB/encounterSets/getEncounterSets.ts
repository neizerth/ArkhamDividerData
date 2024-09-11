import * as API from '@/api/arkhamDB/api';
import { ICache } from '@/types/cache';

export const getEncounterSets = async (): Promise<ICache.EncounterSet[]> => {
  return await API.loadJSONEncounters();
}