import type { IDatabase } from "@/types/database";
import { isNotNil, uniq } from "ramda";
import { getStoryScenarioEncounters } from "./getStoryScenarioEncounters";

/**
 * Encounter set codes that belong to a scenario divider (matched by scenario
 * icon, else by scenario id). These should not also appear in story-level
 * `encounter_sets`.
 */
export const getDedicatedScenarioEncounterCodes = ({
	encounterSets,
	scenarios,
}: {
	encounterSets: IDatabase.EncounterSet[];
	scenarios: IDatabase.StoryScenario[];
}): string[] => {
	const scenarioIds = new Set(
		getStoryScenarioEncounters({ encounterSets, scenarios }),
	);

	return uniq(
		scenarios
			.filter((scenario) => scenarioIds.has(scenario.id))
			.map((scenario) => {
				const icon = scenario.icon || scenario.id;
				const byIcon = encounterSets.find(
					(encounter) => encounter.icon === icon,
				);
				if (byIcon) {
					return byIcon.code;
				}
				return encounterSets.find((encounter) => encounter.code === scenario.id)
					?.code;
			})
			.filter(isNotNil),
	);
};
