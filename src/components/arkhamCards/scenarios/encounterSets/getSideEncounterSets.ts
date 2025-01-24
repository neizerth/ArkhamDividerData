import type { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { isNotNil, prop, propEq } from 'ramda';
import { getSideCampaign } from '../getSideCampaign';
import { showWarning } from '@/util/console';
import type { IArkhamCards } from '@/types/arkhamCards';
import { onlyWords } from '@/util/common';

export const getSideEncounterSets = (): ICache.ScenarioEncounterSet[] => {
  const sideCampaign = getSideCampaign();

  if (!sideCampaign) {
    return [];
  }

  const standaloneScenarios = Cache.getStandaloneScenarios()
    .map(prop('scenarioId'));
    
  const packEncounterSets = Cache.getPackEncounterSets();
  const packs = Cache.getPacks();


  const findPack = ({ id, scenario_name }: IArkhamCards.JSON.Scenario) => {
    const packById = packs.find(propEq(id, 'code'));

    if (packById) {
      return packById;
    }

    const packByName = packs.find(
      ({ name }) => name.toLowerCase() === scenario_name.toLowerCase()
    );

    if (packByName) {
      return packByName;
    }

    const packByEncounterSet = packEncounterSets.find(propEq(id, 'encounter_set_code'));
    
    if (packByEncounterSet) {
      return packs.find(propEq(packByEncounterSet.pack_code, 'code'));
    }

    const packByWords = packs.find(
      pack => onlyWords(pack.name).toLowerCase() === 
        onlyWords(scenario_name).toLowerCase()
    )

    if (packByWords) {
      return packByWords;
    }

    return;
    // sideScenarios.find(propEq(scenario.id, 'scenario_id'))
  }

  const { scenarios, campaign } = sideCampaign;

  const packEncounters = scenarios
    .filter(({ id }) => standaloneScenarios.includes(id))
    .flatMap(scenario => {
      const pack = findPack(scenario);
      
      if (!pack) {
        showWarning(`pack not found: ${scenario.id}`);
      }

      const packCode = pack?.code;
      const cycleCode = pack?.cycle_code;

      const scenarioEncounters = scenario.steps
        .map(prop('encounter_sets'))
        .filter(isNotNil)
        .flat();

      const getIsExtraFromEncounters = (code: string) => packEncounterSets.some(
        encounter => {
          return encounter.encounter_set_code === code && 
            encounter.pack_code !== packCode;
        });

      const getIsExtra = (code: string) => Boolean(pack) && getIsExtraFromEncounters(code);

      const scenarioData = {
        cycle_code: packCode,
        pack_code: cycleCode,
        campaign_id: campaign.id,
        scenario_id: scenario.id,
      }
      
      return scenarioEncounters.map(encounter_set_code => ({
        ...scenarioData,
        encounter_set_code,
        is_extra: getIsExtra(encounter_set_code),
      }))
    })
    .filter(isNotNil);

  return packEncounters as ICache.ScenarioEncounterSet[];
}