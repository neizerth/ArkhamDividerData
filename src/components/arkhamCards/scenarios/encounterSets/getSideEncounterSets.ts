import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { isNotNil, prop, propEq } from 'ramda';
import { getSideCampaign } from '../getSideCampaign';

export const getSideEncounterSets = (): ICache.ScenarioEncounterSet[] => {
  const packEncounterSets = Cache.getPackEncounterSets();

  const packs = Cache.getPacks();
  const sideScenarios = Cache.getSideScenarios();

  const sideCampaign = getSideCampaign();

  if (!sideCampaign) {
    return [];
  }

  const { scenarios, campaign } = sideCampaign;

  const packEncounters = scenarios.map(scenario => {
    const link = sideScenarios.find(propEq(scenario.id, 'scenario_id'));
    
    if (!link) {
      return;
    }

    const {
      cycle_code,
      pack_code,
    } = link;

    const scenarioEncounters = scenario.steps
      .map(prop('encounter_sets'))
      .filter(isNotNil)
      .flat();

    const getIsExtra = (code: string) => packEncounterSets.some(encounter => {
      return encounter.encounter_set_code === code && 
        encounter.cycle_code !== cycle_code;
    })

    const scenarioData = {
      cycle_code,
      pack_code,
      campaign_id: campaign.id,
      scenario_id: scenario.id,
    }
    
    return scenarioEncounters.map(encounter_set_code => ({
      ...scenarioData,
      encounter_set_code,
      is_extra: getIsExtra(encounter_set_code),
    }))
  })
  .flat()
  .filter(isNotNil);

  return packEncounters as ICache.ScenarioEncounterSet[];
}