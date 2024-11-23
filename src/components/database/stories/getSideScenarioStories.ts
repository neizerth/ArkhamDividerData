import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError } from "@/util/console";
import packsData from '@/data/arkhamCards/packs.json'
import scenariosData from '@/data/arkhamCards/scenarios.json'

import { isNotNil, prop, propEq, uniq } from "ramda";
import { getSideCampaign } from "@/components/arkhamCards/scenarios/getSideCampaign";
import { createStoryScenarioHandler } from "./scenarios/getStoryScenario";
import { IconDBType } from "@/types/icons";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";
import { ICache } from "@/types/cache";
import { getStoryCustomContent } from "./features/getStoryCustomContent";

export const getSideScenarioStories = (): IDatabase.Story[] => {
  const packs = Cache.getPacks();
  const scenarioEncounterSets = Cache.getScenarioEncounterSets();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const sideScenarios = Cache.getSideScenarios();
  const sideCampaign = getSideCampaign();
  const packInvestigators = Cache.getPackInvestigators();

  const withoutSizeSupport = packsData
    .filter(propEq(false, 'is_size_supported'))
    .map(prop('pack_code'));

  if (!sideCampaign) {
    showError('side campaign not found');
    return [];
  }

  const { scenarios } = sideCampaign;

  const iconDB = createIconDB(IconDBType.STORY);
  
  const getStoryScenario = createStoryScenarioHandler({
    iconDB,
    scenarioEncounters: scenarioEncounterSets,
    encounterSets
  })

  return scenarios
    .map(scenario => {
      
      const link = sideScenarios.find(({ scenario_id }) => scenario_id === scenario.id);

      if (!link) {
        showError(`link not found: ${scenario.id}`);
        return;
      }

      const packCode = link.pack_code;

      const pack = packs.find(propEq(packCode, 'code'));
      
      const scenarioEncounters = scenarioEncounterSets.filter(
        propEq(scenario.id, 'scenario_id')
      );

      const requiredEncounters = scenarioEncounters.filter(
        propEq(false, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const extraEncounters = scenarioEncounters.filter(
        propEq(true, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const name = pack?.name || scenario.scenario_name;
      
      const {
        code = scenario.id,
      } = pack || {} as ICache.Pack;

      const scenarioInfo = scenariosData.find(propEq(scenario.id, 'id'));
      const {
        is_official,
        is_canonical
      } = Object.assign({}, pack, scenarioInfo);

      const isSizeSupported = is_official && 
        is_canonical && 
        !withoutSizeSupport.includes(code);

      const icon = iconDB.getIcon(code);
      const type = scenario.side_scenario_type || IDatabase.StoryType.SIDE;

      const storyScenario = getStoryScenario({
        campaignId: sideCampaign.campaign.id, 
        scenario,
      });

      const storyScenarioEncounters = getStoryScenarioEncounters({
        encounterSets,
        scenarios: [storyScenario]
      });

      const investigators = pack ? 
        packInvestigators.filter(
          propEq(pack.code, 'pack_code')
        ) : [];

      return {
        name,
        code,
        icon,
        type,
        investigators,
        pack_code: pack?.code,
        cycle_code: pack?.cycle_code,
        scenario: storyScenario,
        custom_content: getStoryCustomContent(scenario.custom),
        is_size_supported: Boolean(isSizeSupported),
        is_canonical,
        is_official,
        scenario_encounter_sets: storyScenarioEncounters,
        encounter_sets: uniq(requiredEncounters),
        extra_encounter_sets: uniq(extraEncounters)
      }
    })
    .filter(isNotNil)
}