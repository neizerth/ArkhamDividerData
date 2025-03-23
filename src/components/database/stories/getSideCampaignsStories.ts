import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError, showWarning } from "@/util/console";
import packsData from '@/data/arkhamCards/packs'

import { isNotNil, prop, propEq } from "ramda";
import type { SingleValue } from "@/types/common";
import { SIDE_STORY_CODE } from "@/api/arkhamDB/constants";
import { createStoryScenarioHandler } from "./scenarios/getStoryScenario";
import { groupStoryScenarios } from "./scenarios/groupStoryScenarios";
import { IconDBType } from "@/types/icons";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";
import { getStoryCustomContent } from "./features/getStoryCustomContent";
import { checkScenario } from "./scenarios/checkScenario";

export const getSideCampaignStories = (): IDatabase.Story[] => {
  const packs = Cache.getPacks();
  const scenarioEncounterSets = Cache.getScenarioEncounterSets();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const sideScenarios = Cache.getSideScenarios();
  const fullCampaigns = Cache.getCampaigns();
  const packInvestigators = Cache.getPackInvestigators();

  const withoutSizeSupport = packsData
    .filter(propEq(false, 'is_size_supported'))
    .map(prop('pack_code'));

  const iconDB = createIconDB(IconDBType.STORY);
  
  const getStoryScenario = createStoryScenarioHandler({
    iconDB,
    scenarioEncounters: scenarioEncounterSets,
    encounterSets
  })

  const sideCampaignIds = sideScenarios
    .filter(
      ({ cycle_code, scenario_id }) => !scenario_id && cycle_code === SIDE_STORY_CODE
    )
    .map(prop('campaign_id'))
    .filter(isNotNil)

  return fullCampaigns
    .filter(({ campaign }) => sideCampaignIds.includes(campaign.id))
    .map(({ campaign, scenarios }) => {
      
      const link = sideScenarios.find(({ campaign_id }) => campaign_id === campaign.id);
      
      if (!link) {
        showError(`link not found: ${campaign.id}`);
        return;
      }

      const pack = packs.find(propEq(link.pack_code, 'code'));

      if (!pack) {
        showWarning(`pack not found: ${link.pack_code}`);
      }
      
      const scenarioEncounters = scenarioEncounterSets.filter(
        propEq(campaign.id, 'campaign_id')
      );

      const requiredEncounters = scenarioEncounters.filter(
        propEq(false, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const extraEncounters = scenarioEncounters.filter(
        propEq(true, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const name = pack?.name || campaign.name;
      
      const {
        is_official,
        is_canonical,
        code = campaign.id,
      } = pack || {} as SingleValue<typeof packs>;

      const isSizeSupported = is_official && 
        is_canonical && 
        !withoutSizeSupport.includes(code);

      const icon = iconDB.getIcon(code);
      const type = IDatabase.StoryType.SIDE_CAMPAIGN;

      const storyScenarios = scenarios
        .map(
          scenario => getStoryScenario({
            campaignId: campaign.id,
            scenario
          })
        );

      const storyScenarioGroups = groupStoryScenarios({
        iconDB,
        scenarios: storyScenarios
      })

      const storyScenarioEncounters = getStoryScenarioEncounters({
        encounterSets,
        scenarios: storyScenarios
      });

      const investigators = pack ? 
        packInvestigators.filter(
          propEq(pack.code, 'pack_code')
        ) : [];

      const customContent = campaign.custom && getStoryCustomContent({
        code,
        content: campaign.custom
      });

      return {
        name,
        code,
        icon,
        type,
        investigators,
        cycle_code: pack?.cycle_code,
        pack_code: pack?.code,
        campaign_id: campaign.id,
        scenarios: storyScenarioGroups.filter(checkScenario),
        custom_content: customContent,
        is_size_supported: Boolean(isSizeSupported),
        is_canonical,
        is_official,
        scenario_encounter_sets: storyScenarioEncounters,
        encounter_sets: requiredEncounters,
        extra_encounter_sets: extraEncounters
      }
    })
    .filter(isNotNil)
}