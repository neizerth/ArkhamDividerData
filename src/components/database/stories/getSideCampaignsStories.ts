import { SIDE_STORY_CODE } from "@/api/arkhamDB/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import packsData from "@/data/arkhamCards/packs";
import type { SingleValue } from "@/types/common";
import { IDatabase } from "@/types/database";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import {
	createEncounterCanonicalLookup,
	normalizeEncounterCodes,
} from "@/util/encounterCanonical";
import { showError, showWarning } from "@/util/console";
import { isNotNil, prop, propEq } from "ramda";
import { getStoryCustomContent } from "./features/getStoryCustomContent";
import { checkScenario } from "./scenarios/checkScenario";
import { createStoryScenarioHandler } from "./scenarios/getStoryScenario";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";
import { groupStoryScenarios } from "./scenarios/groupStoryScenarios";

export const getSideCampaignStories = (): IDatabase.Story[] => {
	const packs = Cache.getPacks();
	const scenarioEncounterSets = Cache.getScenarioEncounterSets();
	const encounterSets = Cache.getDatabaseEncounterSets();
	const sideScenarios = Cache.getSideScenarios();
	const fullCampaigns = Cache.getCampaigns();
	const packInvestigators = Cache.getPackInvestigators();

	const withoutSizeSupport = packsData
		.filter((pack) => pack.is_size_supported === false)
		.map(prop("pack_code"));

	const iconDB = createIconDB(IconDBType.STORY);

	const canonicalizeEncounterCode = createEncounterCanonicalLookup(
		Cache.getEncounterSets(),
	);

	const getStoryScenario = createStoryScenarioHandler({
		iconDB,
		scenarioEncounters: scenarioEncounterSets,
		encounterSets,
		canonicalizeEncounterCode,
	});

	const sideCampaignIds = sideScenarios
		.filter(
			({ cycle_code, scenario_id }) =>
				!scenario_id && cycle_code === SIDE_STORY_CODE,
		)
		.map(prop("campaign_id"))
		.filter(isNotNil);

	return fullCampaigns
		.filter(({ campaign }) => sideCampaignIds.includes(campaign.id))
		.map(({ campaign, scenarios }) => {
			const link = sideScenarios.find(
				({ campaign_id }) => campaign_id === campaign.id,
			);

			if (!link) {
				showError(`link not found: ${campaign.id}`);
				return;
			}

			const pack = packs.find(propEq(link.pack_code, "code"));

			if (!pack) {
				showWarning(`pack not found: ${link.pack_code}`);
			}

			const scenarioEncounters = scenarioEncounterSets.filter(
				propEq(campaign.id, "campaign_id"),
			);

			const requiredEncounters = normalizeEncounterCodes(
				scenarioEncounters
					.filter(propEq(false, "is_extra"))
					.map(prop("encounter_set_code")),
				canonicalizeEncounterCode,
			);

			const extraEncounters = normalizeEncounterCodes(
				scenarioEncounters
					.filter(propEq(true, "is_extra"))
					.map(prop("encounter_set_code")),
				canonicalizeEncounterCode,
			);

			const name = pack?.name || campaign.name;

			const {
				is_official,
				is_canonical,
				code = campaign.id,
			} = pack || ({} as SingleValue<typeof packs>);

			const isSizeSupported =
				is_official && is_canonical && !withoutSizeSupport.includes(code);

			const icon = iconDB.getIcon({ id: code, type: "scenario" });
			// const type = IDatabase.StoryType.SIDE_CAMPAIGN;
			const type = IDatabase.StoryType.SIDE;

			const storyScenarios = scenarios.map((scenario) =>
				getStoryScenario({
					campaignId: campaign.id,
					scenario,
				}),
			);

			const storyScenarioGroups = groupStoryScenarios({
				iconDB,
				scenarios: storyScenarios,
			});

			const storyScenarioEncounters = getStoryScenarioEncounters({
				encounterSets,
				scenarios: storyScenarios,
				canonicalizeEncounterCode,
			});

			const investigators = pack
				? packInvestigators.filter(propEq(pack.code, "pack_code"))
				: [];

			const customContent =
				campaign.custom &&
				getStoryCustomContent({
					code,
					content: campaign.custom,
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
				extra_encounter_sets: extraEncounters,
			};
		})
		.filter(isNotNil);
};
