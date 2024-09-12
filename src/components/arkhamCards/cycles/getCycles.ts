import * as API from "@/api/arkhamCards/api"
import { NON_CANONICAL_CODE } from "@/api/arkhamCards/constants";
import { ICache } from "@/types/cache";

export const getCycles = async (): Promise<ICache.Cycle[]> => {
  console.log('getting Arkham Cards cycles...')
  const cycles = await API.loadJSONCycles();

  return cycles.map(({ 
    code, 
    name, 
    official, 
    position 
  }) => {
    return {
      code,
      name,
      position,
      source: ICache.Source.ARKHAM_CARDS,
      is_official: official,
      is_canonical: official && code !== NON_CANONICAL_CODE
    }
  })
  // loadJSONCycles
};