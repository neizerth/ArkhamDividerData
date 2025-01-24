import * as API from '@/api/arkhamCards/api';
import { ICache } from '@/types/cache';
import type { SingleValue } from '@/types/common';
import { getCycles } from '@/util/cache';
import { propEq } from 'ramda';

export const getPacks = async (): Promise<ICache.Pack[]> => {
  const packs = await API.loadJSONPacks();
  const cycles = getCycles();
  
  return packs.map(({ 
    code, 
    name,
    position,
    cycle_code
  }) => {
    const cycle = cycles.find(propEq(cycle_code, 'code')) || {} as SingleValue<typeof cycles>
    const { 
      is_canonical, 
      is_official 
    } = cycle;
    
    return {
      code,
      cycle_code,
      name,
      position,
      source: ICache.Source.ARKHAM_CARDS,
      is_canonical,
      is_official,
    }
  });
}