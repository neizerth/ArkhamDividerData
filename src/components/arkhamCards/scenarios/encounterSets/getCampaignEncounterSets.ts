import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { arkham_db_mapping as cyclesMapping } from '@/data/arkhamCards/cycles.json';
import { showError, showWarning, showSuccess } from '@/util/console';

import { isNotNil, prop, propEq } from 'ramda';
import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';

export type IFindPack = {
  id: string
  name: string
};

export const getCampaignEncounterSets = (): ICache.ScenarioEncounterSet[] => {
  const encounterSets = Cache.getPackEncounterSets();
  
  const fullCampaigns = Cache.getCampaigns()
    .filter(({ campaign }) => campaign.id !== SIDE_STORIES_CODE);
    
  const packs = Cache.getPacks();

  const findPack = ({ id, name }: IFindPack) => {
    const packByCode = packs.find(propEq(id, 'code'));
    if (packByCode) {
      return packByCode;
    }
    showWarning(`packs not found: ${id}`);
    const cyclePack = packs.find(propEq(id, 'cycle_code'));

    if (cyclePack) {
      showSuccess('found packs in cycles!');
      return cyclePack;
    }

    showWarning(`cycle packs not found: ${id}`);

    const campaignMatch = cyclesMapping.find(propEq(id, 'campaign_id'));

    if (campaignMatch) {
      showSuccess('found in mapping!');

      return packs.find(propEq(campaignMatch.pack_code, 'code'));
    }

    const packByName = packs.find(propEq(name, 'name'));
    
    if (packByName) {
      showSuccess('found by name!');
      return packByName;
    }

    return;
  }

  const packEncounters = fullCampaigns.map(({ campaign, scenarios }) => {
    const campaignPack = findPack(campaign);
    
    if (!campaignPack) {
      showError(`pack not found: ${campaign.id}`);
      return false;
    }

    const {
      code,
      cycle_code,
      is_canonical,
      is_official
    } = campaignPack;

    const packScenarioEncounters = scenarios.map(scenario => {
      
      const scenarioEncounters = scenario.steps
        .map(prop('encounter_sets'))
        .filter(isNotNil)
        .flat();

      const getIsExtra = (code: string) => encounterSets.some(encounter => {
        return encounter.encounter_set_code === code && 
          encounter.cycle_code !== cycle_code;
      })

      const scenarioData = {
        cycle_code,
        pack_code: code,
        campaign_id: campaign.id,
        scenario_id: scenario.id,
        is_canonical,
        is_official
      }
      
      return scenarioEncounters.map(encounter_set_code => ({
        ...scenarioData,
        encounter_set_code,
        is_extra: getIsExtra(encounter_set_code),
        is_canonical,
        is_official
      }))
    })

    return packScenarioEncounters.flat();
  });

  const encounters = packEncounters.flat().filter(isNotNil);

  return encounters as ICache.ScenarioEncounterSet[];
}