import type { IDatabase } from "@/types/database";

/**
 * Keep scenarios that are playable dividers. Narrative-only interludes are
 * dropped, but interludes with their own encounter set stay — including Return
 * campaigns where the set is `return_to_${id}` while the scenario id is reused
 * (e.g. Return to Disappearance at the Twilight Estate).
 */
export const checkScenario = ({
	id,
	type,
	encounter_sets = [],
}: IDatabase.StoryScenario) => {
	if (id === "core") {
		return false;
	}

	if (type !== "interlude") {
		return true;
	}

	return (
		encounter_sets.includes(id) || encounter_sets.includes(`return_to_${id}`)
	);
};
