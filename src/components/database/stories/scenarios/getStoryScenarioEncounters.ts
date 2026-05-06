import type { IDatabase } from "@/types/database";
import { normalizeEncounterCodes } from "@/util/encounterCanonical";
import { isNotNil, propEq } from "ramda";

export const getStoryScenarioEncounters = ({
	encounterSets,
	scenarios,
	canonicalizeEncounterCode,
}: {
	encounterSets: IDatabase.EncounterSet[];
	scenarios: IDatabase.StoryScenario[];
	canonicalizeEncounterCode: (code: string) => string;
}) => {
	const encounters = scenarios
		.map(({ icon, id, type }) => {
			if (id === 'core') {
				return null;
			}
			if (type === "interlude") {
				return null;
			}
			if (!icon) {
				return encounterSets.find(propEq(id, "code"))?.code ?? null;
			}
			const code = encounterSets.find(
				(encounter) => encounter.icon === icon,
			)?.code;

			return code ?? null;
		})
		.filter(isNotNil);

	return normalizeEncounterCodes(encounters, canonicalizeEncounterCode);
};
