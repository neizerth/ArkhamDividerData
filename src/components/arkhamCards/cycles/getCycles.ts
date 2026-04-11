import * as API from "@/api/arkhamCards/api";
import { NON_CANONICAL_CODE } from "@/api/arkhamCards/constants";
import * as GraphQL from "@/api/arkhamCards/graphQL";
import { ICache } from "@/types/cache";
import { propEq } from "ramda";

export const getCycles = async (): Promise<ICache.Cycle[]> => {
  const localCycles = await getLocalCycles();
  const graphQLCycles = await getGraphQLCycles();

  const qlCycles = graphQLCycles.filter(
    ({ code }) => !localCycles.some(propEq(code, 'code'))
  );

  return [...qlCycles, ...localCycles];
}

const getGraphQLCycles = async (): Promise<ICache.Cycle[]> => {
  const cycles = await GraphQL.loadCycles();

  return cycles.map((cycle): ICache.Cycle => ({
    code: cycle.code,
    name: cycle.name,
    position: cycle.position,
    source: ICache.Source.ARKHAM_CARDS,
    is_canonical: cycle.official,
    is_official: cycle.official,
  }));
}

export const getLocalCycles = async (): Promise<ICache.Cycle[]> => {
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
      is_official: official || code === NON_CANONICAL_CODE,
      is_canonical: official && code !== NON_CANONICAL_CODE
    }
  })
  // loadJSONCycles
};