import { getCycleDir, getPackFileBase } from "@/api/arkhamDB/api";
import { SCENARIO_PACKS_CODE } from "@/api/arkhamDB/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { ARKHAMDB_DATA_FOLDER_NAME } from "@/config/api";
import { DOWNLOADS_DIR } from "@/config/app";
import type { IArkhamDB } from "@/types/arkhamDB";
import { IDatabase } from "@/types/database";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import fs from "node:fs";
import path from "node:path";
import { prop, propEq, uniq } from "ramda";
import { getDedicatedScenarioEncounterCodes } from "./scenarios/getDedicatedScenarioEncounterCodes";
import { getStoryScenarioEncounters } from "./scenarios/getStoryScenarioEncounters";

const readPackCards = (cycleCode: string, packCode: string) => {
	if (!ARKHAMDB_DATA_FOLDER_NAME) {
		return [];
	}

	const file = path.join(
		DOWNLOADS_DIR,
		ARKHAMDB_DATA_FOLDER_NAME,
		"pack",
		getCycleDir(cycleCode),
		`${getPackFileBase(cycleCode, packCode)}.json`,
	);

	if (!fs.existsSync(file)) {
		return [];
	}

	try {
		const data = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
		return Array.isArray(data) ? (data as IArkhamDB.JSON.Card[]) : [];
	} catch {
		return [];
	}
};

/** Printed scenario title from the scenario card when Arkham Cards has no guide. */
const scenarioCardName = (cards: IArkhamDB.JSON.Card[], encounterCode: string) =>
	cards.find(
		(card) =>
			card.type_code === "scenario" && card.encounter_code === encounterCode,
	)?.name;

export const getScenarioPackStories = (): IDatabase.Story[] => {
	const packs = Cache.getPacks().filter(
		propEq(SCENARIO_PACKS_CODE, "cycle_code"),
	);
	const scenarioEncounterSets = Cache.getScenarioEncounterSets();
	const encounterSets = Cache.getDatabaseEncounterSets();
	const packInvestigators = Cache.getPackInvestigators();
	const iconDB = createIconDB(IconDBType.STORY);

	const stories: IDatabase.Story[] = [];

	for (const pack of packs) {
		const links = scenarioEncounterSets.filter(
			(link) =>
				link.pack_code === pack.code && link.cycle_code === SCENARIO_PACKS_CODE,
		);
		if (links.length === 0) {
			continue;
		}

		const cards = readPackCards(pack.cycle_code, pack.code);
		const scenarioIds = uniq(links.map(prop("scenario_id")));
		const scenarios = scenarioIds.map((id) => {
			const name = scenarioCardName(cards, id) ?? pack.name;

			return {
				id,
				campaign_id: pack.code,
				scenario_name: name,
				full_name: name,
				header: "",
				icon: iconDB.getIcon({ id, type: "scenario" }),
				encounter_sets: uniq(
					links
						.filter(propEq(id, "scenario_id"))
						.map(prop("encounter_set_code")),
				),
				extra_encounter_sets: [],
			};
		});

		const dedicatedScenarioEncounterCodes = new Set(
			getDedicatedScenarioEncounterCodes({
				encounterSets,
				scenarios,
			}),
		);

		stories.push({
			name: pack.name,
			code: pack.code,
			icon: iconDB.getIcon({ id: pack.code }),
			type: IDatabase.StoryType.SIDE,
			...(pack.chapter != null ? { chapter: pack.chapter } : {}),
			investigators: packInvestigators.filter(propEq(pack.code, "pack_code")),
			pack_code: pack.code,
			cycle_code: pack.cycle_code,
			scenarios,
			is_size_supported: pack.is_official && pack.is_canonical,
			is_canonical: pack.is_canonical,
			is_official: pack.is_official,
			scenario_encounter_sets: getStoryScenarioEncounters({
				encounterSets,
				scenarios,
			}),
			encounter_sets: uniq(links.map(prop("encounter_set_code"))).filter(
				(code) => !dedicatedScenarioEncounterCodes.has(code),
			),
			extra_encounter_sets: [],
		});
	}

	return stories;
};
