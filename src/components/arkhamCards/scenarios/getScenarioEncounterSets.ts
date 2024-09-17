import { ICache } from '@/types/cache';
import { getCampaignEncounterSets } from './encounterSets/getCampaignEncounterSets';
import { getSideEncounterSets } from './encounterSets/getSideEncounterSets';

export const getScenarioEncounterSets = (): ICache.ScenarioEncounterSet[] => {
  const data = [];

  console.log('caching campaign scenario encounter sets...');
  data.push(...getCampaignEncounterSets());

  console.log('caching side scenarios encounter sets...');
  data.push(...getSideEncounterSets());

  return data;
}
