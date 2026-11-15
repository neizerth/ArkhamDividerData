import { ICache } from "@/types/cache";
import type { IDatabase } from "@/types/database";
import { prefix } from "@/util/common";
import { filterEncounterSet } from "@/util/criteria";
import path from "path";
import { identity, isNotNil, prop, uniq } from "ramda";

export const CUSTOM_POSITION_OFFSET = 200;

let position = 1;

export type CustomStoryType =
	| "campaign"
	| "standalone"
	| "challenge"
	| "side_campaign"
	| "side_story";
("parallel");

type CustomScenario = Omit<
	IDatabase.StoryScenario,
	"header" | "full_name" | "campaign_id"
> & {
	prefix?: string | false | boolean;
	campaign_id?: string;
	header?: string;
	full_name?: string;
	/** Size of the dedicated scenario encounter set (synthesized into encounterSets). */
	size?: number;
	types?: IDatabase.EncounterSetType[];
};

type CustomEncounterSet = Omit<
	IDatabase.EncounterSet,
	"synonyms" | "is_canonical" | "is_official"
> & {
	prefix?: boolean;
};

type CustomStory = Omit<
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

export type CreateCustomContentOptions = {
	dir?: string;
	prefix?: string | false;
	icons?: Array<{
		icon: string;
		width: number;
		height: number;
		circled?: boolean;
	}>;
	scenarios?: CustomScenario[] | false;
	encounterSets?: CustomEncounterSet[];
	story: CustomStory;
};

export type CustomContentEncounter = IDatabase.EncounterSet & {
	prefix?: boolean;
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

	let scenarios: IDatabase.StoryScenario[] = [];

	if (options.scenarios !== false) {
		scenarios = options.scenarios
			? options.scenarios.map((scenario) => {
					const {
						size: _size,
						types: _types,
						prefix: _prefix,
						...scenarioRest
					} = scenario;
					const iconId = scenario.icon || scenario.id;
					const icon = scenario.prefix === false ? iconId : toId(iconId);
					return {
						...scenarioRest,
						id: toId(scenario.id),
						icon,
						campaign_id: code,
						full_name: scenario.full_name || scenario.scenario_name,
						header: scenario.header || scenario.scenario_name,
						encounter_sets:
							scenario.encounter_sets?.map(toId) ||
							[toId(scenario.id)].filter(filterEncounterSet),
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
	}

	let campaignScenarios: string[] = [];

	if (options.scenarios !== false) {
		campaignScenarios =
			scenarios.length > 0 ? scenarios.map(prop("id")) : [code];
	}

	const campaign: IDatabase.StoryCampaign = {
		id: code,
		name,
		scenarios: campaignScenarios,
		icon: code,
	};

	const explicitEncounterCodes = new Set(
		(options.encounterSets || []).map(prop("code")),
	);

	const scenarioEncounterInputs: CustomEncounterSet[] = Array.isArray(
		options.scenarios,
	)
		? options.scenarios
				.filter(
					(scenario) =>
						(scenario.size != null || scenario.types != null) &&
						!explicitEncounterCodes.has(scenario.id),
				)
				.map((scenario) => ({
					code: scenario.id,
					name: scenario.scenario_name,
					...(scenario.size != null ? { size: scenario.size } : {}),
					...(scenario.types != null ? { types: scenario.types } : {}),
					...(scenario.icon ? { icon: scenario.icon } : {}),
					...(scenario.prefix === false ? { prefix: false } : {}),
				}))
		: [];

	const encounters: CustomContentEncounter[] = [
		...scenarioEncounterInputs,
		...(options.encounterSets || []),
	].map((encounterSet) => {
		const getIcon = encounterSet.prefix === false ? identity : toId;
		return {
			...encounterSet,
			...packEncounterSetBase,
			code: toId(encounterSet.code),
			icon: getIcon(encounterSet.icon || encounterSet.code),
		};
	});

	const requiredEncounters =
		options.story.encounter_sets || encounters.map(prop("code"));

	const scenarioRequiredEncounters = scenarios
		.flatMap(prop("encounter_sets"))
		.filter(isNotNil);

	const scenarioEncounterSets =
		options.story.scenario_encounter_sets || campaignScenarios;

	const dedicatedScenarioEncounterCodes = new Set(scenarioEncounterSets);

	const encounterSets = uniq([
		...requiredEncounters,
		...scenarioRequiredEncounters,
	])
		.filter(
			(encounterCode) => !dedicatedScenarioEncounterCodes.has(encounterCode),
		)
		.filter(filterEncounterSet);

	const extraEncounters = uniq([
		...(options.story.extra_encounter_sets || []),
		...scenarios.flatMap(prop("extra_encounter_sets")).filter(isNotNil),
	]).filter(filterEncounterSet);

	const story: IDatabase.Story = {
		...options.story,
		icon: options.story.icon || code,
		scenarios,
		campaigns: options.story.campaigns || [campaign],
		is_size_supported: options.story.is_size_supported || false,
		encounter_sets: encounterSets,
		scenario_encounter_sets: scenarioEncounterSets,
		extra_encounter_sets: extraEncounters,
		investigators: options.story.investigators || [],
	};

	const icons = options.icons?.map((item) => ({
		...item,
		icon: item.icon === code ? code : `${code}-${item.icon}`,
	}));

	return {
		pack,
		encounterSets: encounters,
		story,
		iconsDir,
		icons,
	};
};
