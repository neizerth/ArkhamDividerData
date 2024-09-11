import * as API from '@/api/arkhamCards/api';
import { ICache } from '@/types/cache';

export const getEncounterSets = async (): Promise<ICache.EncounterSet[]> => {
  return await API.loadJSONEncounterSets();
}