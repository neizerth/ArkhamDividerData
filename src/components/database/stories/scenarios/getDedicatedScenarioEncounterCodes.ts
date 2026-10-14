import type { IDatabase } from "@/types/database";
import { isNotNil, uniq } from "ramda";
import { getStoryScenarioEncounters } from "./getStoryScenarioEncounters";

/**
 * Encounter set codes that back a scenario divider and must not also appear in
 * story-level `encounter_sets`.
 *
 * Only the scenario's own set (code === scenario id, or icon === id) counts.
 * Multi-part scenarios may reuse another set's icon for art (EoE:
 * `ice_and_death_part_1` → icon `the_crash`) — that set stays in
 * `encounter_sets`.
 *
 * Also covers interludes/prologues that share a code with an encounter set
 * (TCU `disappearance_at_the_twilight_estate`).
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
		.map((scenario) => {
			const byCode = encounterSets.find(
				(encounter) => encounter.code === scenario.id,
			);
			if (byCode) {
				return byCode.code;
			}

			// 1:1 scenario encounter set: icon is the scenario id itself.
			if (scenario.icon && scenario.icon === scenario.id) {
				const byIcon = encounterSets.find(
					(encounter) =>
						encounter.icon === scenario.icon ||
						encounter.code === scenario.icon,
				);
				if (byIcon) {
					return byIcon.code;
				}
			}

			return undefined;
		})
		.filter(isNotNil);

	// Any scenario/interlude id that matches an encounter set code is that
	// scenario's own set — never a separate campaign encounter divider.
	const byScenarioId = scenarios
		.map(
			(scenario) =>
				encounterSets.find((encounter) => encounter.code === scenario.id)?.code,
		)
		.filter(isNotNil);

	return uniq([...fromDividers, ...byScenarioId]);
};
