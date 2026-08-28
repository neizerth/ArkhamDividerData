import type { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import { prop, uniq } from "ramda";
import { compact } from "ramda-adjunct";

export type StoryIconMetadata = Pick<IDatabase.Story, "pack_code" | "cycle_code">;

const collectStoryIcons = (
	story: IDatabase.Story,
	encounterSetIcons: ReadonlyMap<string, string | undefined>,
): string[] => {
	const encounters = compact([
		...story.encounter_sets,
		...story.scenario_encounter_sets,
	]);

	const encounterIcons = encounters.map(
		(encounter) => encounterSetIcons.get(encounter),
	);
	const scenarioIcons = story.scenarios?.map((scenario) => scenario.icon) ?? [];
	const campaignIcons = story.campaigns?.map(prop("icon")) ?? [];

	return uniq(
		compact([
			story.icon,
			story.scenario?.icon,
			...scenarioIcons,
			...campaignIcons,
			...encounterIcons,
		]) as string[],
	);
};

export const buildEncounterSetIconLookup = (
	encounterSets: IDatabase.EncounterSet[],
) =>
	new Map(encounterSets.map(({ code, icon }) => [code, icon] as const));

export const getStoryIcons = (story: IDatabase.Story): string[] => {
	const encounterSetIcons = buildEncounterSetIconLookup(
		Cache.getDatabaseEncounterSets(),
	);

	return collectStoryIcons(story, encounterSetIcons);
};

export const buildStoryIconIndex = (
	stories: IDatabase.Story[],
	encounterSets: IDatabase.EncounterSet[],
): Map<string, StoryIconMetadata> => {
	const encounterSetIcons = buildEncounterSetIconLookup(encounterSets);
	const iconToStory = new Map<string, StoryIconMetadata>();

	for (const story of stories) {
		const metadata: StoryIconMetadata = {
			pack_code: story.pack_code,
			cycle_code: story.cycle_code,
		};

		for (const icon of collectStoryIcons(story, encounterSetIcons)) {
			if (!iconToStory.has(icon)) {
				iconToStory.set(icon, metadata);
			}
		}
	}

	return iconToStory;
};

export const buildEncounterSetCodeByIcon = (
	encounterSets: IDatabase.EncounterSet[],
): Map<string, string> => {
	const encounterSetCodeByIcon = new Map<string, string>();

	for (const { code, icon } of encounterSets) {
		if (icon) {
			encounterSetCodeByIcon.set(icon, code);
		}
	}

	return encounterSetCodeByIcon;
};
