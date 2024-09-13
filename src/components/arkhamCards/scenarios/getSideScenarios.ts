import * as Cache from '@/util/cache';
import { showWarning } from "@/util/console";
import { isNotNil, prop, propEq } from "ramda";
import { getSideCampaign } from './getSideCampaign';
import { ICache } from '@/types/cache';
import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';

export const getSideScenarios = (): ICache.SideScenario[] => {
  const packs = Cache.getPacks();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const standaloneScenarios = Cache.getStandaloneScenarios()
    .filter(
      propEq(SIDE_STORIES_CODE, 'campaignId')
    )
    .map(prop('scenarioId'));

  const findPack = ({ id, scenario_name }: {
    id: string,
    scenario_name: string
  }) => {
    const packByCode = packs.find(propEq(id, 'code'));

    if (packByCode) {
      return packByCode;
    }

    const encounterSet = encounterSets.find(
      encounter => encounter.pack_code && 
        encounter.code === id
    )

    if (encounterSet) {
      const pack = packs.find(propEq(encounterSet.pack_code, 'code'));
      if (pack) {
        return pack;
      }
    }

    const packByName = packs.find(
      pack => pack.name.toLowerCase() === scenario_name.toLowerCase()
    )

    if (packByName) {
      return packByName;
    }

    return;
  }

  const sideCampaign = getSideCampaign();

  if (!sideCampaign) {
    return [];
  }

  const { scenarios, campaign } = sideCampaign;

  return scenarios.map(scenario => {
    const pack = findPack(scenario);

    if (!standaloneScenarios.includes(scenario.id)) {
      console.log(`scenario ${scenario.id} not in standalone list. Skipping`);
      return;
    }

    if (!pack) {
      showWarning(`scenario pack not found: ${scenario.id}`);
    }

    return {
      campaign_id: campaign.id,
      scenario_id: scenario.id,
      pack_code: pack?.code,
      cycle_code: pack?.cycle_code
    }
  })
  .filter(isNotNil);
}

