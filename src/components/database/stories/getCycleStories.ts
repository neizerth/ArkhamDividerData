import { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import { showError } from "@/util/console";
import {
  without_size_support as withoutSizeSupport,
  ignore_campaign_scenarios,
} from "@/data/arkhamCards/cycles.json";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { isNotNil, prop, propEq, uniq } from "ramda";

import * as ArkhamDBConstants from "@/api/arkhamDB/constants";
import * as ArkhamCardsConstants from "@/api/arkhamCards/constants";
import { createStoryScenarioHandler } from "./scenarios/getStoryScenario";
import { createStoryCampaignHandler } from "./features/getStoryCampaign";
import { groupStoryScenarios } from "./scenarios/groupStoryScenarios";
import { IconDBType } from "@/types/icons";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";
import { checkScenario } from "./scenarios/checkScenario";
import { getStoryCustomContent } from "./features/getStoryCustomContent";

const CAMPAIGN_SKIP_CYCLE_CODES = [
  ...ArkhamDBConstants.SPECIAL_CAMPAIGN_TYPES,
  ...ArkhamCardsConstants.SPECIAL_CAMPAIGN_TYPES,
];

export const getCycleStories = (): IDatabase.Story[] => {
  const fullCampaigns = Cache.getCampaigns();
  const cycles = Cache.getCycles();
  const packs = Cache.getPacks();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const scenarioEncounterSets = Cache.getScenarioEncounterSets();
  const packEncounters = Cache.getPackEncounterSets();
  const packInvestigators = Cache.getPackInvestigators();

  const iconDB = createIconDB(IconDBType.STORY);

  const storyHandlerData = {
    iconDB,
    scenarioEncounters: scenarioEncounterSets,
    encounterSets,
  };

  const getStoryScenario = createStoryScenarioHandler(storyHandlerData);
  const getCampaignScenario = createStoryCampaignHandler(storyHandlerData);

  return cycles
    .filter(({ is_official, code }) => {
      if (CAMPAIGN_SKIP_CYCLE_CODES.includes(code)) {
        return false;
      }
      if (!is_official) {
        return false;
      }

      const encounters = encounterSets.filter(
        ({ cycle_code }) => cycle_code === code
      );

      return encounters.length > 0;
    })
    .map(({ code, is_canonical, is_official, position, ...cycle }) => {
      const cycleEncounters = scenarioEncounterSets.filter(
        propEq(code, "cycle_code")
      );

      if (cycleEncounters.length === 0) {
        showError(`cycle encounters not found: ${code}`);
        return;
      }

      const campaignsIds = uniq(cycleEncounters.map(prop("campaign_id")));

      const campaigns = fullCampaigns.filter(({ campaign }) =>
        campaignsIds.includes(campaign.id)
      );

      const requiredEncounters = [];
      const extraEncounters = [];
      const storyScenarios: IDatabase.StoryScenario[] = [];

      if (campaigns.length === 0) {
        showError(`campaigns not found: ${code}`);

        const campaignEncounters = packEncounters
          .filter(propEq(code, "cycle_code"))
          .map(prop("encounter_set_code"));

        requiredEncounters.push(...campaignEncounters);
      } else {
        const scenarios = campaigns.flatMap(({ campaign, scenarios }) =>
          scenarios.map((scenario) =>
            getStoryScenario({
              campaignId: campaign.id,
              scenario,
            })
          )
        );

        storyScenarios.push(...scenarios);

        const toEncounterCode = prop("encounter_set_code");

        const filterEncounters = (required: boolean) =>
          uniq(
            cycleEncounters
              .filter(propEq(!required, "is_extra"))
              .map(toEncounterCode)
          );

        requiredEncounters.push(...filterEncounters(true));
        extraEncounters.push(...filterEncounters(false));

        const restEncounters = packEncounters
          .filter(
            ({ cycle_code, encounter_set_code }) =>
              cycle_code === code &&
              !requiredEncounters.includes(encounter_set_code) &&
              !extraEncounters.includes(encounter_set_code)
          )
          .map(toEncounterCode);

        requiredEncounters.push(...restEncounters);
      }

      const cyclePacks = packs.filter((pack) => {
        if (code !== pack.cycle_code) {
          return false;
        }
        const packEncounters = encounterSets.filter(
          ({ pack_code }) => pack_code === pack.code
        );
        return packEncounters.length > 0;
      });

      if (cyclePacks.length === 0) {
        showError(`cycle packs not found: ${code}`);
        return;
      }
      const [fullCampaign] = campaigns;

      const isSizeSupported = is_official && !withoutSizeSupport.includes(code);

      const type =
        fullCampaign?.campaign.campaign_type || IDatabase.StoryType.CAMPAIGN;

      const icon = iconDB.getIcon(code);

      const packCodes = cyclePacks.map(prop("code"));

      const storyCampaigns = campaigns.map((fullCampaign) =>
        getCampaignScenario({
          fullCampaign,
          cycle_code: code,
        })
      );

      // const name = campaigns.length

      const campaignData =
        campaigns.length === 1
          ? {
              name: campaigns[0].campaign.name,
              campaign_id: campaigns[0].campaign.id,
            }
          : {
              name: cycle.name,
              campaigns,
            };

      const ignoredScenarios =
        ignore_campaign_scenarios.find(propEq(code, "campaign_id"))
          ?.scenario_ids || [];

      const allowedScenarios = storyScenarios.filter(
        (scenario) => !ignoredScenarios.includes(scenario.id)
      );

      const storyScenariosGroup = groupStoryScenarios({
        scenarios: allowedScenarios,
        iconDB,
      });

      // const storyScenarioEncounters = storyScenarios.
      const storyScenarioEncounters = getStoryScenarioEncounters({
        encounterSets,
        scenarios: allowedScenarios,
      });

      const investigators = packInvestigators.filter(
        propEq(code, "cycle_code")
      );

      const customContent =
        fullCampaign.campaign?.custom &&
        getStoryCustomContent({
          code,
          content: fullCampaign.campaign.custom,
        });

      return {
        ...campaignData,
        code,
        icon,
        type,
        cycle_code: code,
        is_canonical,
        is_official,
        position,
        investigators,
        scenario_encounter_sets: storyScenarioEncounters,
        custom_content: customContent,
        campaigns: storyCampaigns,
        scenarios: storyScenariosGroup.filter(checkScenario),
        pack_codes: packCodes,
        is_size_supported: isSizeSupported,
        encounter_sets: requiredEncounters,
        extra_encounter_sets: extraEncounters,
      };
    })
    .filter(isNotNil);
};
