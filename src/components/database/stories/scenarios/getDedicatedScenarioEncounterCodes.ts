import type { IDatabase } from "@/types/database";
import { uniq } from "ramda";
import { getStoryScenarioEncounters } from "./getStoryScenarioEncounters";

const ownSetCodes = (
	scenario: IDatabase.StoryScenario,
	encounterSets: IDatabase.EncounterSet[],
): string[] => {
	const codes: string[] = [];

	const byCode = encounterSets.find(
		(encounter) => encounter.code === scenario.id,
	);
	if (byCode) {
		codes.push(byCode.code);
	}

	// Return campaigns reuse the original scenario id but ship
	// `return_to_${id}` as the scenario's own encounter set.
	const returnCode = `return_to_${scenario.id}`;
	const byReturn = encounterSets.find(
		(encounter) => encounter.code === returnCode,
	);
	if (byReturn) {
		codes.push(byReturn.code);
	}

	// Match by printed scenario name (Return to Disappearance…).
	if (scenario.scenario_name) {
		const byName = encounterSets.find(
			(encounter) => encounter.name === scenario.scenario_name,
		);
		if (byName) {
			codes.push(byName.code);
		}
	}

	// 1:1 scenario encounter set: icon is the scenario id itself.
	if (scenario.icon && scenario.icon === scenario.id) {
		const byIcon = encounterSets.find(
			(encounter) =>
				encounter.icon === scenario.icon || encounter.code === scenario.icon,
		);
		if (byIcon) {
			codes.push(byIcon.code);
		}
	}

	return codes;
};

/**
 * Encounter set codes that back a scenario divider and must not also appear in
 * story-level `encounter_sets`.
 *
 * Only the scenario's own set counts. Multi-part scenarios may reuse another
 * set's icon for art (EoE: `ice_and_death_part_1` → icon `the_crash`) — that
 * set stays in `encounter_sets`.
 *
 * Also covers:
 * - interludes with a same-code set (TCU Disappearance)
 * - Return campaigns where the set is `return_to_${id}` while the scenario id
 *   is reused (Return to Disappearance at the Twilight Estate)
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

	const fromDividers = scenarios
		.filter((scenario) => scenarioIds.has(scenario.id))
		.flatMap((scenario) => ownSetCodes(scenario, encounterSets));

	const byScenarioId = scenarios.flatMap((scenario) =>
		ownSetCodes(scenario, encounterSets),
	);

	return uniq([...fromDividers, ...byScenarioId]);
};
