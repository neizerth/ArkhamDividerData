import type { IDatabase } from "@/types/database";
import { isNotNil, propEq, uniq } from "ramda";

export const getStoryScenarioEncounters = ({
	encounterSets,
	scenarios,
}: {
	encounterSets: IDatabase.EncounterSet[];
	scenarios: IDatabase.StoryScenario[];
}) => {
	const encounters = scenarios
		.map(({ icon, id, type }) => {
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

	return uniq(encounters);
};
