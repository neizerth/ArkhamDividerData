import type { IDatabase } from "@/types/database";
import { isNotNil, propEq, uniq } from "ramda";

export const getStoryScenarioEncounters = ({
	encounterSets,
	scenarios,
}: {
	encounterSets: IDatabase.EncounterSet[];
	scenarios: IDatabase.StoryScenario[];
}) => {
	// `scenario_encounter_sets` is a list of scenario ids that have a dedicated
	// encounter set (usually the same code as the scenario, but not always).
	// We return scenario ids here (not encounter set codes) to avoid situations like
	// `fate_of_the_vale` → encounter set `the_vale`, which would otherwise pollute
	// the scenario list with encounter-set-only codes.
	const encounters = scenarios
		.map(({ icon, id, type }) => {
			if (id === "core") {
				return null;
			}
			// Skip narrative-only interludes, but keep those with their own
			// encounter set (TCU Disappearance, or Return's `return_to_${id}`).
			if (type === "interlude" || type === "epilogue" || type === "prologue") {
				const hasOwnSet = Boolean(
					encounterSets.find(propEq(id, "code")) ||
						encounterSets.find(propEq(`return_to_${id}`, "code")),
				);
				return hasOwnSet ? id : null;
			}

			if (!icon) {
				const hasEncounter = Boolean(encounterSets.find(propEq(id, "code")));
				return hasEncounter ? id : null;
			}

			const hasEncounter = Boolean(
				encounterSets.find((encounter) => encounter.icon === icon),
			);

			return hasEncounter ? id : null;
		})
		.filter(isNotNil);

	// NOTE: we intentionally do NOT canonicalize these ids with
	// encounter canonicalization, because these are *scenario ids*, not encounter
	// set codes.
	return uniq(encounters);
};
