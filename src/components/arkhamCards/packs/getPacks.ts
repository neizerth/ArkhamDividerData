import * as API from '@/api/arkhamCards/api';
import { NON_CANONICAL_CODE } from '@/api/arkhamCards/constants';
import { ICache } from '@/types/cache';

export const getPacks = async (): Promise<ICache.Pack[]> => {
  const packs = await API.loadJSONPacks();
  
  return packs.map(({ 
    code, 
    name,
    position,
    cycle_code
  }) => {
    const isCanonical = code !== NON_CANONICAL_CODE;

    return {
      code,
      cycle_code,
      name,
      position,
      source: ICache.Source.ARKHAM_CARDS,
      is_official: !isCanonical,
      is_canonical: isCanonical 
    }
  });
}