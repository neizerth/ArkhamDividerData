import * as Cache from '@/util/cache';
import { showError, showWarning } from "@/util/console";
import { isNotNil, prop, propEq } from "ramda";
import { getSideCampaign } from './getSideCampaign';
import type { ICache } from '@/types/cache';
import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';
import type { IArkhamCards } from '@/types/arkhamCards';
import { SIDE_STORY_CODE } from '@/api/arkhamDB/constants';
import { onlyWords } from '@/util/common';

export const getSideScenarios = (): ICache.SideScenario[] => {
  const packs = Cache.getPacks();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const packEncounterSets = Cache.getPackEncounterSets();
  const fullCampaigns = Cache.getCampaigns();
  
  const standaloneScenarios = Cache.getStandaloneScenarios()
    .filter(
      propEq(SIDE_STORIES_CODE, 'campaignId')
    )
    .map(prop('scenarioId'));

  const findPack = ({ id, scenario_name }: IArkhamCards.JSON.Scenario) => {
    const packByCode = packs.find(propEq(id, 'code'));

    if (packByCode) {
      return packByCode;
    }

    const packByName = packs.find(
      pack => pack.name.toLowerCase() === scenario_name.toLowerCase()
    )

    if (packByName) {
      return packByName;
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

    const packByWords = packs.find(
      pack => onlyWords(pack.name).toLowerCase() === 
        onlyWords(scenario_name).toLowerCase()
    )

    if (packByWords) {
      return packByWords;
    }

    const packByEncounterSet = packEncounterSets.find(propEq(id, 'encounter_set_code'));
    
    if (packByEncounterSet) {
      return packs.find(propEq(packByEncounterSet.pack_code, 'code'));
    }

    return;
  }

  const sideCampaign = getSideCampaign();

  if (!sideCampaign) {
    return [];
  }

  const { scenarios, campaign } = sideCampaign;

  const fromScenarios = scenarios.map(scenario => {
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

  const packCodes = fromScenarios
    .map(
      prop('pack_code')
    )
    .filter(isNotNil);

  const sidePacks = packs.filter(({ code, cycle_code }) => {
    if (cycle_code !== SIDE_STORY_CODE) {
      return false;
    }
    if (packCodes.includes(code)) {
      return false;
    }
    return true;
  });

  const campaignPacks = sidePacks
    .map(({ code, cycle_code, name }) => {
      const fullCampaign = fullCampaigns.find(
        ({ campaign }) => campaign.id === code || campaign.name === name
      );

      if (!fullCampaign) {
        showError(`campaign ${code} not found!`);
        return;
      }
      
      return {
        campaign_id: fullCampaign.campaign.id,
        pack_code: code,
        cycle_code: cycle_code
      }
    })
    .filter(isNotNil);

  const campaignPackCodes = campaignPacks.map(prop('pack_code'));

  const scenarioPacks = sidePacks
    .filter(({ code }) => !campaignPackCodes.includes(code))
    .map(({ code, cycle_code, name }) => {
      const scenario = sideCampaign.scenarios.find(
        ({ full_name, header, scenario_name, id }) => {
          
          if (id === code) {
            return true;
          }

          const nameMatches = [
            scenario_name, 
            full_name, 
            header
          ].includes(name);

          if (nameMatches) {
            return true;
          }
          return false;
        }
      );

      if (!scenario) {
        showError(`scenario ${code} not found `)
        return;
      }
      
      return {
        campaign_id: sideCampaign.campaign.id,
        scenario_id: scenario?.id,
        pack_code: code,
        cycle_code: cycle_code
      }
    })
    .filter(isNotNil);


  return [
    ...fromScenarios,
    ...campaignPacks,
    ...scenarioPacks
  ]
}

