import * as ArkhamDB from '@/api/arkhamDB/api';
import { ICache } from '@/types/cache';

export const getPacks = async (): Promise<ICache.Pack[]> => {
  const packs = await ArkhamDB.loadJSONPacks();

  return packs.map(({ 
    code,
    name,
    cycle_code,
    date_release,
    cgdb_id,
    position
  }) => {
    return {
      code,
      name,
      source: ICache.Source.ARKHAMDB,
      cycle_code,
      date_release,
      cgdb_id,
      position,
      is_canonical: true,
      is_official: true,
    }
  });
}