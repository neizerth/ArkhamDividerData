import type { IDatabase } from "@/types/database";
import { uniq } from "ramda";
import { ownSetCodes } from "./getDedicatedScenarioEncounterCodes";

export const getStoryScenarioEncounters = ({
	encounterSets,
	scenarios,
}: {
	encounterSets: IDatabase.EncounterSet[];
	scenarios: IDatabase.StoryScenario[];
}) => {
	const encounters = scenarios.flatMap((scenario) => {
		const { id, type } = scenario;
		if (id === "core") {
			return [];
		}
		if (type === "epilogue" || type === "prologue") {
			return [];
		}
		return ownSetCodes(scenario, encounterSets);
	});

	return uniq(encounters);
};
