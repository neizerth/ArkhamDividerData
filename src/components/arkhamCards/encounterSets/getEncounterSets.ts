import * as API from '@/api/arkhamCards/api';
import { ICache } from '@/types/cache';

export const getEncounterSets = async (): Promise<ICache.EncounterSet[]> => {
  const data = await API.loadJSONEncounterSets();

  return data.map(encounter => ({
    ...encounter,
    synonyms: []
  }))
}