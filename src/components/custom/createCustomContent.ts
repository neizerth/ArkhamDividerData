import type { IDatabase } from "@/types/database";
import { ICache } from "@/types/cache";
import { identity, prop, uniq } from "ramda";
import path from "path";
import { prefix } from "@/util/common";

export const CUSTOM_POSITION_OFFSET = 200;

let position = 1;

export type CustomStoryType =
	| "campaign"
	| "standalone"
	| "challenge"
	| "side_campaign"
	| "side_story";
("parallel");

export type CreateCustomContentOptions = {
	dir?: string;
	prefix?: string | false;
	icons?: Array<{
		icon: string;
		width: number;
		height: number;
		circled?: boolean;
	}>;
	scenarios?: Array<
		Omit<IDatabase.StoryScenario, "header" | "full_name" | "campaign_id"> & {
			prefix?: string | false | boolean;
			campaign_id?: string;
			header?: string;
			full_name?: string;
		}
	>;
	encounterSets?: Omit<
		IDatabase.EncounterSet,
		"synonyms" | "is_canonical" | "is_official"
	>[];
	story: Omit<
		IDatabase.Story,
		| "type"
		| "scenario_encounter_sets"
		| "encounter_sets"
		| "extra_encounter_sets"
		| "investigators"
		| "is_size_supported"
	> & {
		type: CustomStoryType;
		scenario_encounter_sets?: string[];
		encounter_sets?: string[];
		extra_encounter_sets?: string[];
		investigators?: ICache.PackInvestigator[];
		is_size_supported?: boolean;
	};
};

export const createCustomContent = (options: CreateCustomContentOptions) => {
	const { dir } = options;

	const iconsDir = dir && path.join(dir, "icons");
	const { name, code, type } = options.story;

	const cycleCode = type.includes("campaign") ? "zcam" : "zsid";

	const withCode = options.prefix !== false ? prefix(`${code}-`) : identity;

	const baseData = {
		cycle_code: cycleCode,
		is_canonical: false,
		is_official: false,
	};

	const source = ICache.Source.ARKHAM_DIVIDER;
	const pack: ICache.Pack = {
		...baseData,
		code,
		name,
		source,
		position: CUSTOM_POSITION_OFFSET + position++,
	};

	const packEncounterSetBase = {
		...baseData,
		pack_code: code,
		synonyms: [],
	};

	const toId = (id: string) => (id === code ? code : withCode(id));

	const scenarios: IDatabase.StoryScenario[] = options.scenarios
		? options.scenarios.map((scenario) => {
				const iconId = scenario.icon || scenario.id;
				const icon = scenario.prefix === false ? iconId : toId(iconId);
				return {
					...scenario,
					id: toId(scenario.id),
					icon,
					campaign_id: code,
					full_name: scenario.full_name || scenario.scenario_name,
					header: scenario.header || scenario.scenario_name,
					encounter_sets: scenario.encounter_sets?.map(toId) || [
						toId(scenario.id),
					],
				};
			})
		: [
				{
					id: code,
					icon: code,
					campaign_id: code,
					scenario_name: name,
					header: name,
					full_name: name,
				},
			];

	const campaignScenarios =
		scenarios.length > 0 ? scenarios.map(prop("id")) : [code];

	const campaign: IDatabase.StoryCampaign = {
		id: code,
		name,
		scenarios: campaignScenarios,
		icon: code,
	};

	const encounters: IDatabase.EncounterSet[] =
		options.encounterSets?.map((encounterSet) => ({
			...encounterSet,
			...packEncounterSetBase,
			code: toId(encounterSet.code),
			icon: toId(encounterSet.icon || encounterSet.code),
		})) || [];

	const scenarioEncounters: IDatabase.EncounterSet[] = scenarios.map(
		(scenario) => ({
			...packEncounterSetBase,
			name: scenario.scenario_name,
			code: toId(scenario.id),
			icon: toId(scenario.id),
		}),
	);

	const requiredEncounters =
		options.story.encounter_sets || encounters.map(prop("code"));

	const scenarioRequiredEncounters = scenarios.flatMap(prop("encounter_sets"));

	const encounterSets = uniq([
		...requiredEncounters,
		...campaignScenarios,
		...scenarioRequiredEncounters,
	]).filter(identity);

	const extraEncounters = uniq([
		...(options.story.extra_encounter_sets || []),
		...scenarios.flatMap(prop("extra_encounter_sets")),
	]).filter(identity);

	const story: IDatabase.Story = {
		...options.story,
		icon: options.story.icon || code,
		scenarios,
		campaigns: options.story.campaigns || [campaign],
		is_size_supported: options.story.is_size_supported || false,
		encounter_sets: encounterSets,
		scenario_encounter_sets:
			options.story.scenario_encounter_sets || campaignScenarios,
		extra_encounter_sets: extraEncounters,
		investigators: options.story.investigators || [],
	};

	const icons = options.icons?.map((item) => ({
		...item,
		icon: item.icon === code ? code : `${code}-${item.icon}`,
	}));

	return {
		pack,
		encounterSets: [...encounters, ...scenarioEncounters],
		story,
		iconsDir,
		icons,
	};
};
