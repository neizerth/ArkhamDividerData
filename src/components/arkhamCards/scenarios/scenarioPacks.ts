import { SCENARIO_PACKS_CODE } from "@/api/arkhamDB/constants";
import type { ICache } from "@/types/cache";
import * as Cache from "@/util/cache";
import { propEq } from "ramda";

const isScenarioSet = (set: ICache.PackEncounterSet) =>
	set.types?.some((type) => type.type === "scenario") ?? false;

/**
 * Arkham Cards has no campaign guide for Scenario Packs yet.
 * Each pack is one product: the encounter set that contains the scenario card
 * is the scenario, and the other sets in the box belong to it.
 * Skip a pack once a real campaign already links it.
 */
export const getScenarioPackEncounterSets = (
	existing: ICache.ScenarioEncounterSet[],
): ICache.ScenarioEncounterSet[] => {
	const linkedPacks = new Set(
		existing.map((link) => link.pack_code).filter(Boolean),
	);
	const packEncounterSets = Cache.getPackEncounterSets();

	return Cache.getPacks()
		.filter(propEq(SCENARIO_PACKS_CODE, "cycle_code"))
		.flatMap((pack) => {
			if (linkedPacks.has(pack.code)) {
				return [];
			}

			const sets = packEncounterSets.filter(propEq(pack.code, "pack_code"));
			if (sets.length === 0) {
				return [];
			}

			const scenarioSets = sets.filter(isScenarioSet);
			const scenarioIds =
				scenarioSets.length > 0
					? scenarioSets.map((set) => set.encounter_set_code)
					: [sets[0].encounter_set_code];

			return scenarioIds.flatMap((scenarioId) =>
				sets.map((set) => ({
					campaign_id: pack.code,
					scenario_id: scenarioId,
					cycle_code: pack.cycle_code,
					pack_code: pack.code,
					encounter_set_code: set.encounter_set_code,
					is_extra: false,
				})),
			);
		});
};
