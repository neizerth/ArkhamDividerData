import type { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { showError } from '@/util/console';

import { isNotNil, prop, propEq } from 'ramda';
import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';
import packsData from '@/data/arkhamCards/packs'

export const getCampaignEncounterSets = (): ICache.ScenarioEncounterSet[] => {
  const encounterSets = Cache.getPackEncounterSets();
  
  const fullCampaigns = Cache.getCampaigns()
    .filter(({ campaign }) => campaign.id !== SIDE_STORIES_CODE);
    
  const packs = Cache.getPacks();
  const campaignLinks = Cache.getCampaignLinks();
  

  const packEncounters = fullCampaigns.map(({ campaign, scenarios }) => {
    const link = campaignLinks
      .find(
        propEq(campaign.id, 'campaign_id')
      );
    
    if (!link) {
      showError(`link not found: ${campaign.id}`);
      return [];
    }

    const pack = packs.find(propEq(link.pack_code, 'code'));
    
    if (!pack) {
      showError(`pack not found: ${campaign.id}`);
      return [];
    }

    const {
      code,
      cycle_code,
    } = pack;

    const additionalCodes = packsData
      .find(
        propEq(code, 'pack_code')
      )?.add_encounter_sets || [];

    const packScenarioEncounters = scenarios.map(scenario => {
      
      const scenarioEncounters = scenario.steps
        .map(prop('encounter_sets'))
        .filter(isNotNil)
        .flat()
        .concat(additionalCodes)

      const getIsExtra = (code: string) => encounterSets.some(encounter => {
        return encounter.encounter_set_code === code && 
          encounter.cycle_code !== cycle_code;
      });

      const scenarioData = {
        cycle_code,
        pack_code: code,
        campaign_id: campaign.id,
        scenario_id: scenario.id,
      }
      
      return scenarioEncounters.map(encounter_set_code => ({
        ...scenarioData,
        encounter_set_code,
        is_extra: getIsExtra(encounter_set_code),
      }))
    })

    return packScenarioEncounters.flat();
  });

  const encounters = packEncounters
    .flat()
    .filter(isNotNil);

  return encounters as ICache.ScenarioEncounterSet[];
}