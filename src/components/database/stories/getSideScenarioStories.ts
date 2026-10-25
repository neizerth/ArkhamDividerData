import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { getSideCampaign } from "@/components/arkhamCards/scenarios/getSideCampaign";
import packsData from "@/data/arkhamCards/packs";
import scenariosData from "@/data/arkhamCards/scenarios.json";
import { IDatabase } from "@/types/database";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import { showError } from "@/util/console";
import {
	createEncounterCanonicalLookup,
	normalizeEncounterCodes,
} from "@/util/encounterCanonical";
import { groupBy, isNotNil, prop, propEq, uniq, values } from "ramda";
import { getStoryCustomContent } from "./features/getStoryCustomContent";
import { checkScenario } from "./scenarios/checkScenario";
import { getDedicatedScenarioEncounterCodes } from "./scenarios/getDedicatedScenarioEncounterCodes";
import { getStoryEncounterSetSizes } from "./scenarios/getEncounterSetSizes";
import { createStoryScenarioHandler } from "./scenarios/getStoryScenario";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";
import { groupStoryScenarios } from "./scenarios/groupStoryScenarios";

export const getSideScenarioStories = (): IDatabase.Story[] => {
	const packs = Cache.getPacks();
	const scenarioEncounterSets = Cache.getScenarioEncounterSets();
	const encounterSets = Cache.getDatabaseEncounterSets();
	const sideScenarios = Cache.getSideScenarios();
	const sideCampaign = getSideCampaign();
	const packInvestigators = Cache.getPackInvestigators();

	const withoutSizeSupport = packsData
		.filter((pack) => pack.is_size_supported === false)
		.map(prop("pack_code"));

	if (!sideCampaign) {
		showError("side campaign not found");
		return [];
	}

	const { scenarios } = sideCampaign;

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

	const items = scenarios
		.map((scenario) => {
			const link = sideScenarios.find(
				({ scenario_id }) => scenario_id === scenario.id,
			);

			if (!link) {
				showError(`link not found: ${scenario.id}`);
				return;
			}

			return {
				scenario,
				link,
			};
		})
		.filter(isNotNil);

	const groups = values(
		groupBy((item) => {
			return item.link.pack_code;
		}, items),
	).map((items) => {
		const scenarios = items.map(prop("scenario"));
		const link = items[0].link;

		return {
			scenarios,
			link,
		};
	});

	return groups
		.map(({ link, scenarios }) => {
			const packCode = link.pack_code;

			const pack = packs.find(propEq(packCode, "code"));

			if (!pack) {
				showError(`pack not found: ${packCode}`);
				return;
			}

			const scenarioEncounters = scenarioEncounterSets.filter(
				({ scenario_id }) => scenarios.some(propEq(scenario_id, "id")),
			);

			const requiredEncounters = scenarioEncounters
				.filter(propEq(false, "is_extra"))
				.map(prop("encounter_set_code"));

			const name = pack.name;

			const { code } = pack;

			const [scenario] = scenarios;

			const scenarioInfo = scenariosData.find(propEq(scenario.id, "id"));
			const { is_official, is_canonical } = Object.assign(
				{},
				pack,
				scenarioInfo,
			);

			const isSizeSupported =
				is_official && is_canonical && !withoutSizeSupport.includes(code);

			const icon = iconDB.getIcon({ id: code });
			const type = scenario.side_scenario_type || IDatabase.StoryType.SIDE;

			const storyScenarios = scenarios.map((scenario) =>
				getStoryScenario({
					campaignId: sideCampaign.campaign.id,
					scenario,
				}),
			);

			const storyScenarioGroups = groupStoryScenarios({
				iconDB,
				scenarios: storyScenarios,
				encounterSets,
			}).filter(checkScenario);

			const storyEncounterSetSizes = getStoryEncounterSetSizes({
				scenarios: storyScenarioGroups,
				encounterSets,
			});

			const storyScenarioEncounters = getStoryScenarioEncounters({
				encounterSets,
				scenarios: storyScenarioGroups,
			});

			const scenarioExtraEncounters = uniq(
				storyScenarioGroups
					.flatMap((storyScenario) => storyScenario.extra_encounter_sets ?? [])
					.filter(isNotNil),
			);
			const scenarioExtraEncounterCodes = new Set(scenarioExtraEncounters);

			const dedicatedScenarioEncounterCodes = new Set(
				getDedicatedScenarioEncounterCodes({
					encounterSets,
					scenarios: storyScenarioGroups,
				}),
			);

			const investigators = packInvestigators.filter(
				propEq(pack.code, "pack_code"),
			);

			const customContent =
				scenario.custom &&
				getStoryCustomContent({
					code,
					content: scenario.custom,
				});

			return {
				name,
				code,
				icon,
				type,
				investigators,
				pack_code: code,
				cycle_code: pack.cycle_code,
				scenarios: storyScenarioGroups,
				custom_content: customContent,
				is_size_supported: Boolean(isSizeSupported),
				is_canonical,
				is_official,
				scenario_encounter_sets: storyScenarioEncounters,
				encounter_sets: normalizeEncounterCodes(
					requiredEncounters,
					canonicalizeEncounterCode,
				).filter(
					(encounterCode) =>
						!dedicatedScenarioEncounterCodes.has(encounterCode) &&
						!scenarioExtraEncounterCodes.has(encounterCode),
				),
				extra_encounter_sets: normalizeEncounterCodes(
					scenarioExtraEncounters,
					canonicalizeEncounterCode,
				),
				...(storyEncounterSetSizes.length > 0
					? { encounter_set_data: storyEncounterSetSizes }
					: {}),
			};
		})
		.filter(isNotNil);
};
