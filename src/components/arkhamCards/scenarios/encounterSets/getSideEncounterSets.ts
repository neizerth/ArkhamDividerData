import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { arkham_db_mapping as packsMapping } from '@/data/arkhamCards/packs.json';

import { showError, showSuccess, showWarning } from '@/util/console';

import { isNotNil, prop, propEq } from 'ramda';
import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';

export const getSideEncounterSets = (): ICache.ScenarioEncounterSet[] => {
  const packEncounterSets = Cache.getPackEncounterSets();
  const encounterSets = Cache.getDatabaseEncounterSets();

  const fullCampaigns = Cache.getCampaigns();
  const packs = Cache.getPacks();

  const sideCampaign = fullCampaigns.find(({ campaign }) => campaign.id === SIDE_STORIES_CODE)

  if (!sideCampaign) {
    return [];
  }

  const { scenarios, campaign } = sideCampaign;

  const findPack = ({ id, scenario_name }: {
    id: string,
    scenario_name: string
  }) => {
    const packByCode = packs.find(propEq(id, 'code'));

    if (packByCode) {
      return packByCode;
    }

    showWarning(`pack not found by code ${id}`);

    const encounterSet = encounterSets.find(
      encounter => encounter.pack_code && 
        encounter.code === id
    )

    if (encounterSet) {
      const pack = packs.find(propEq(encounterSet.pack_code, 'code'));
      if (pack) {
        showSuccess('found in encounter sets!');
        return pack;
      }
      showWarning(`pack not found by encounter code`);
    }

    const packByName = packs.find(
      pack => pack.name.toLowerCase() === scenario_name.toLowerCase()
    )

    if (packByName) {
      return packByName;
    }

    const packMatch = packsMapping.find(propEq(id, 'scenario_id'));

    if (packMatch) {
      showSuccess('found in mapping!');
      const packCode = packMatch.pack_code;

      return packs.find(propEq(packCode, 'code'));
    }

    if (packByName) {
      return packByName;
    }

    return;
  }

  const packEncounters = scenarios.map(scenario => {
    const pack = findPack(scenario);
    
    if (!pack) {
      showError(`pack not found: ${scenario.id}`);
      return;
    }

    const {
      cycle_code,
      code,
      is_canonical,
      is_official
    } = pack;

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
  });

  const encounters = packEncounters.flat().filter(isNotNil);

  return encounters as ICache.ScenarioEncounterSet[];
}