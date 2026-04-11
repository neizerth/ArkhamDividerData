import * as GraphQL from '@/api/arkhamCards/graphQL';
import { IArkhamDB } from '@/types/arkhamDB';

export const getInvestigators = async (): Promise<IArkhamDB.API.Investigator[]> => {
  const investigators = await GraphQL.loadInvestigators();
  return investigators;
}