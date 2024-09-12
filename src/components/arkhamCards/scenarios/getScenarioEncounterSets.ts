import { ICache } from '@/types/cache';
import { SingleValue } from '@/types/common';
import * as Cache from '@/util/cache';
import { isNotNil, prop, propEq } from 'ramda';

type Campaigns = ReturnType<typeof Cache.getCampaigns>;
type Campaign = SingleValue<Campaigns>;

type Scenarios = Campaign['scenarios'];
type Pack = ICache.Pack;

export const getScenarioEncounterSets = async (): Promise<ICache.ScenarioEncounterSet[]> => {
  const encounterSets = Cache.getPackEncounterSets();
  const unavailableEncounters = encounterSets.map(prop('encounter_set_code'));
  
  const fullCampaigns = Cache.getCampaigns();
  const packs = Cache.getPacks();
  const customPackCodes = packs.map(prop('code'));

  const packCampaigns = fullCampaigns.filter(
    ({ campaign }) => customPackCodes.includes(campaign.id)
  );

  const packEncounters = packCampaigns.map(({ campaign, scenarios }): ICache.ScenarioEncounterSet[] => {
    const {
      code,
      cycle_code,
      is_canonical,
      is_official
    } = packs.find(propEq(campaign.id, 'code')) as Pack;
    
    const packScenarioEncounters = scenarios.map(scenario => {
      
      const scenarioEncounters = scenario.steps
        .map(prop('encounter_sets'))
        .filter(isNotNil)
        .flat();

      const scenarioData = {
        scenario_id: scenario.id,
        cycle_code,
        pack_code: code,
        is_canonical,
        is_official
      }
      
      return scenarioEncounters.map(encounter_set_code => ({
        ...scenarioData,
        encounter_set_code,
        is_extra: unavailableEncounters.includes(encounter_set_code),
        is_canonical,
        is_official
      }))
    })

    return packScenarioEncounters.flat();
  });

  return packEncounters.flat();
}
