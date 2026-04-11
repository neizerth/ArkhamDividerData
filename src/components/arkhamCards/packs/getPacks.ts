import * as API from '@/api/arkhamCards/api';
import * as GraphQL from '@/api/arkhamCards/graphQL';
import { ICache } from '@/types/cache';
import type { SingleValue } from '@/types/common';
import { getCycles } from '@/util/cache';
import { propEq } from 'ramda';


export const getPacks = async (): Promise<ICache.Pack[]> => {
  const localPacks = await getLocalPacks();
  const graphQLPacks = await getGraphQLPacks();

  const qlPacks = graphQLPacks.filter(
    ({ code }) => !localPacks.some(propEq(code, 'code'))
  );


  return [...qlPacks, ...localPacks];
}


export const getGraphQLPacks = async (): Promise<ICache.Pack[]> => {
  const packs = await GraphQL.loadPacks();
  return packs.map((pack): ICache.Pack => ({
    code: pack.code,
    cycle_code: pack.cycle_code,
    name: pack.name,
    position: pack.position,
    source: ICache.Source.ARKHAM_CARDS,
    is_canonical: pack.official ?? false,
    is_official: pack.official ?? false,
  }));
}

const getLocalPacks = async (): Promise<ICache.Pack[]> => {
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