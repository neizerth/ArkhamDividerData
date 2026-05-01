import * as ArkhamCardsConstants from "@/api/arkhamCards/constants";
import * as ArkhamDBConstants from "@/api/arkhamDB/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import {
  ignore_campaign_scenarios,
  without_size_support as withoutSizeSupport,
} from "@/data/arkhamCards/cycles.json";
import type { ICache } from "@/types/cache";
import { IDatabase } from "@/types/database";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import { showError } from "@/util/console";
import { filterEncounterSet } from "@/util/criteria";
import { isNotNil, prop, propEq, sort, uniq } from "ramda";
import { createStoryCampaignHandler } from "./features/getStoryCampaign";
import { getStoryCustomContent } from "./features/getStoryCustomContent";
import { checkScenario } from "./scenarios/checkScenario";
import { createStoryScenarioHandler } from "./scenarios/getStoryScenario";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";
import { groupStoryScenarios } from "./scenarios/groupStoryScenarios";

const CAMPAIGN_SKIP_CYCLE_CODES = [
  ...ArkhamDBConstants.SPECIAL_CAMPAIGN_TYPES,
  ...ArkhamCardsConstants.SPECIAL_CAMPAIGN_TYPES,
];

/** Order for splitting the shared `core` cycle by product (pack). */
const CORE_CYCLE_PACK_ORDER = ["core", "core_ch2", "core_2026"];

const compareCorePackCodes = (a: string, b: string) => {
	const ia = CORE_CYCLE_PACK_ORDER.indexOf(a);
	const ib = CORE_CYCLE_PACK_ORDER.indexOf(b);
	if (ia !== -1 && ib !== -1) {
		return ia - ib;
	}
	if (ia !== -1) {
		return -1;
	}
	if (ib !== -1) {
		return 1;
	}
	return a.localeCompare(b);
};

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

  const assembleCycleStory = ({
    cycle,
    cycleEncounters,
    storyCode,
    packScope,
  }: {
    cycle: {
      name: string;
      code: string;
      is_canonical: boolean;
      is_official: boolean;
      position: number;
    };
    cycleEncounters: ICache.ScenarioEncounterSet[];
    storyCode: string;
    packScope?: string;
  }): IDatabase.Story | undefined => {
    const { code, is_canonical, is_official, position, name: cycleName } =
      cycle;

    if (cycleEncounters.length === 0) {
      showError(`cycle encounters not found: ${code}`);
      return;
    }

    const campaignsIds = uniq(cycleEncounters.map(prop("campaign_id")));

    const campaigns = fullCampaigns.filter(({ campaign }) =>
      campaignsIds.includes(campaign.id),
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
          }),
        ),
      );

      storyScenarios.push(...scenarios);

      const toEncounterCode = prop("encounter_set_code");

      const filterEncounters = (required: boolean) =>
        uniq(
          cycleEncounters
            .filter(propEq(!required, "is_extra"))
            .map(toEncounterCode),
        );

      requiredEncounters.push(...filterEncounters(true));
      extraEncounters.push(...filterEncounters(false));

      const restEncounters = packEncounters
        .filter(
          ({ cycle_code, encounter_set_code, pack_code }) =>
            cycle_code === code &&
            (!packScope || pack_code === packScope) &&
            !requiredEncounters.includes(encounter_set_code) &&
            !extraEncounters.includes(encounter_set_code),
        )
        .map(toEncounterCode);

      requiredEncounters.push(...restEncounters);
    }

    const cyclePacks = packs.filter((pack) => {
      if (code !== pack.cycle_code) {
        return false;
      }
      if (packScope && pack.code !== packScope) {
        return false;
      }
      const pe = encounterSets.filter(
        ({ pack_code }) => pack_code === pack.code,
      );
      return pe.length > 0;
    });

    if (cyclePacks.length === 0) {
      showError(`cycle packs not found: ${code}`);
      return;
    }
    const [fullCampaign] = campaigns;

    const isSizeSupported = is_official && !withoutSizeSupport.includes(code);

    const type =
      fullCampaign?.campaign.campaign_type || IDatabase.StoryType.CAMPAIGN;

    const icon = iconDB.getIcon({ id: storyCode });

    const packCodes = cyclePacks.map(prop("code"));

    const storyCampaigns = campaigns.map((fullCampaign) =>
      getCampaignScenario({
        fullCampaign,
        cycle_code: code,
      }),
    );

    const campaignData =
      campaigns.length === 1
        ? {
            name: campaigns[0].campaign.name,
            campaign_id: campaigns[0].campaign.id,
          }
        : {
            name: cycleName,
            campaigns,
          };

    const ignoredScenarios =
      ignore_campaign_scenarios.find(propEq(code, "campaign_id"))
        ?.scenario_ids || [];

    const allowedScenarios = storyScenarios.filter(
      (scenario) => !ignoredScenarios.includes(scenario.id),
    );

    const storyScenariosGroup = groupStoryScenarios({
      scenarios: allowedScenarios,
      iconDB,
    });

    const storyScenarioEncounters = getStoryScenarioEncounters({
      encounterSets,
      scenarios: allowedScenarios,
    });

    const isCore = code === "core" || code === "core_2026";

    const investigators =
      isCore ? [] : packInvestigators.filter(propEq(code, "cycle_code"));

    const customContent =
      fullCampaign.campaign?.custom &&
      getStoryCustomContent({
        code,
        content: fullCampaign.campaign.custom,
      });

    return {
      ...campaignData,
      code: storyCode,
      icon,
      type,
      cycle_code: code,
      is_canonical,
      is_official,
      position,
      investigators,
      scenario_encounter_sets: storyScenarioEncounters.filter(filterEncounterSet),
      custom_content: customContent,
      campaigns: storyCampaigns,
      scenarios: storyScenariosGroup.filter(checkScenario),
      pack_codes: packCodes,
      is_size_supported: isSizeSupported,
      encounter_sets: requiredEncounters.filter(filterEncounterSet),
      extra_encounter_sets: extraEncounters.filter(filterEncounterSet),
    };
  };

  return cycles
    .filter(({ is_official, code }) => {
      if (CAMPAIGN_SKIP_CYCLE_CODES.includes(code)) {
        return false;
      }
      if (!is_official) {
        return false;
      }

      const encounters = encounterSets.filter(
        ({ cycle_code }) => cycle_code === code,
      );

      return encounters.length > 0;
    })
    .flatMap(({ code, is_canonical, is_official, position, name, ...cycle }) => {
      const cycleEncounters = scenarioEncounterSets.filter(
        propEq(code, "cycle_code"),
      );

      if (cycleEncounters.length === 0) {
        showError(`cycle encounters not found: ${code}`);
        return [];
      }

      const cycleRow = {
        code,
        name,
        is_canonical,
        is_official,
        position,
        ...cycle,
      };

      if (CORE_CYCLE_PACK_ORDER.includes(code)) {
        console.log("core code", code);
        const packCodes = uniq(cycleEncounters.map(prop("pack_code")));
        const sorted =
          packCodes.length > 1 ? sort(compareCorePackCodes, packCodes) : packCodes;

        return sorted
          .map((packCode) =>
            assembleCycleStory({
              cycle: cycleRow,
              cycleEncounters: cycleEncounters.filter(propEq(packCode, "pack_code")),
              storyCode: packCode,
              packScope: packCode,
            }),
          )
          .filter(isNotNil);
      }

      const story = assembleCycleStory({
        cycle: cycleRow,
        cycleEncounters,
        storyCode: code,
      });

      return story ? [story] : [];
    });
};
