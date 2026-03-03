import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import type { IDatabase } from "@/types/database";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import { propEq } from "ramda";

export const getInvestigatorStories = (): IDatabase.Story[] => {
	const packInvestigators = Cache.getPackInvestigators();
	const packs = Cache.getPacks();

	const iconDB = createIconDB(IconDBType.COMMON);

	const starterInvestigators = packInvestigators.filter(
		propEq("investigator", "cycle_code"),
	);

	const fanMadeCategories = packs.filter(propEq("zinv", "cycle_code"));

	const parallelCategories = packs.filter(propEq("parallel", "cycle_code"));

	const coreInvestigators = packInvestigators.filter(
		propEq("core", "pack_code"),
	);

	const core2026Investigators = packInvestigators.filter(
		propEq("core_2026", "pack_code"),
	);

	return [
		{
			name: "Core Set",
			code: "core_2016-investigators",
			type: "investigators",
			icon: "core",
			encounter_sets: [],
			extra_encounter_sets: [],
			scenario_encounter_sets: [],
			is_size_supported: false,
			is_official: true,
			is_canonical: true,
			investigators: coreInvestigators,
			position: 1,
		},
		{
			name: "Core 2026",
			code: "core_2026-investigators",
			type: "investigators",
			icon: "core_2026",
			encounter_sets: [],
			extra_encounter_sets: [],
			scenario_encounter_sets: [],
			is_size_supported: false,
			is_official: true,
			is_canonical: true,
			investigators: core2026Investigators,
			position: 1,
		},
		{
			name: "Investigator Starter Decks",
			code: "starter-decks",
			type: "investigators",
			icon: "investigator",
			encounter_sets: [],
			extra_encounter_sets: [],
			scenario_encounter_sets: [],
			is_size_supported: false,
			is_official: true,
			is_canonical: true,
			investigators: starterInvestigators,
		},
		...fanMadeCategories.map(({ code, name, is_canonical, is_official }) => ({
			name,
			code: `${code}-inv`,
			type: "investigators",
			icon: iconDB.getIcon(code, "investigator"),
			encounter_sets: [],
			extra_encounter_sets: [],
			scenario_encounter_sets: [],
			is_size_supported: false,
			is_canonical,
			is_official,
			investigators: packInvestigators.filter(propEq(code, "pack_code")),
		})),
		...parallelCategories.map(({ code, name, is_canonical, is_official }) => ({
			name,
			code: `${code}-inv`,
			type: "challenge",
			icon: "parallel",
			encounter_sets: [],
			extra_encounter_sets: [],
			scenario_encounter_sets: [],
			is_size_supported: false,
			is_canonical,
			is_official,
			investigators: packInvestigators.filter(propEq(code, "pack_code")),
		})),
	];
};
