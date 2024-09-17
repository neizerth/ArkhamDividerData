import * as API from '@/api/arkhamDB/api';
import { ICache } from '@/types/cache';

export const getCycles = async (): Promise<ICache.Cycle[]> => {
  const cycles = await API.loadJSONCycles();

  return cycles.map(({
    code,
    name,
    position,
    size
  }) => {
    return {
      code,
      name,
      position,
      size,
      source: ICache.Source.ARKHAM_CARDS,
      is_official: true,
      is_canonical: true
    }
  })
}