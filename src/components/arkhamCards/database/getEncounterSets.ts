import type { ICache } from "@/types/cache";
import type { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import { toSynonyms } from "@/util/common";
import { showError } from "@/util/console";
import { whereSynonyms } from "@/util/criteria";
import { groupBy, isNotNil, prop, propEq, values } from "ramda";
import { createIconDB } from "../icons/IconDB";

export const getEncounterSets = (): IDatabase.EncounterSet[] => {
	const scenarioEncounters = Cache.getScenarioEncounterSets();
	const encounters = Cache.getEncounterSets();
	const packs = Cache.getPacks();

	const mainScenarioEncounters = scenarioEncounters.filter(
		propEq(false, "is_extra"),
	);

	const iconDB = createIconDB();

	const databaseEncounters = mainScenarioEncounters.map(
		({ cycle_code, encounter_set_code, pack_code }): IDatabase.EncounterSet => {
			const icon = iconDB.getIcon({ id: encounter_set_code });

			const { is_canonical, is_official } =
				packs.find(propEq(pack_code, "code")) || ({} as ICache.Pack);

			const encounterData = {
				code: encounter_set_code,
				cycle_code,
				pack_code,
				is_canonical,
				is_official,
				icon,
			};

			const encounter = encounters.find(whereSynonyms(encounter_set_code));

			if (!encounter) {
				showError(`encounter not found: ${encounter_set_code}`);
				return {
					...encounterData,
					name: encounter_set_code,
					synonyms: [],
				};
			}

			const { code, name, synonyms } = encounter;
			const encounterIcon =
				icon ||
				iconDB.getIconOf({
					ids: toSynonyms(encounter),
				});

			// Prefer the definition primary code so scenario aliases (`sewers`)
			// collapse onto ArkhamDB codes (`arkham_sewers`).
			return {
				...encounterData,
				code,
				name,
				icon: encounterIcon,
				synonyms,
			};
		},
	);

	return values(groupBy(prop("code"), databaseEncounters))
		.map((group = []) => group[0])
		.filter(isNotNil);
};
