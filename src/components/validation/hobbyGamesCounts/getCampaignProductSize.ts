import { getCycleDir } from "@/api/arkhamDB/api";
import { ARKHAMDB_DATA_FOLDER_NAME } from "@/config/api";
import { DOWNLOADS_DIR } from "@/config/app";
import type { ICache } from "@/types/cache";
import type { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import fs from "node:fs";
import path from "node:path";
import { HOBBY_GAMES_SHARED_CYCLES } from "./products";

export type CampaignProductSize = {
	total: number;
	setCount: number;
	setCodes: string[];
};

type BoxCard = {
	code: string;
	back_link?: string;
	quantity?: number;
	encounter_code?: string;
};

/**
 * Retail / Hobby Games box card total: every printed face quantity, except the
 * unique reverse of a 1:1 double-sided pair (those are one piece of cardboard).
 *
 * Shared backs used by many fronts (Masked Carnevale-Goer) stay counted — that
 * matches FFG/Hobby marketing totals for those packs.
 */
export const getRetailBoxCardCount = (cards: BoxCard[]): number => {
	const backLinkCount = new Map<string, number>();
	for (const card of cards) {
		if (!card.back_link) {
			continue;
		}
		backLinkCount.set(
			card.back_link,
			(backLinkCount.get(card.back_link) ?? 0) + 1,
		);
	}

	const soleBacks = new Set(
		[...backLinkCount.entries()]
			.filter(([, count]) => count === 1)
			.map(([id]) => id),
	);

	return cards
		.filter((card) => !soleBacks.has(card.code))
		.reduce((sum, card) => sum + (card.quantity ?? 1), 0);
};

const readJsonArray = (filePath: string): BoxCard[] => {
	if (!fs.existsSync(filePath)) {
		return [];
	}
	try {
		const data = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
		return Array.isArray(data) ? (data as BoxCard[]) : [];
	} catch {
		return [];
	}
};

const loadLocalPackEncounterCards = (
	cycleCode: string,
	packCode: string,
): BoxCard[] => {
	if (!ARKHAMDB_DATA_FOLDER_NAME) {
		return [];
	}

	const dir = path.join(
		DOWNLOADS_DIR,
		ARKHAMDB_DATA_FOLDER_NAME,
		"pack",
		getCycleDir(cycleCode),
	);

	const cards = [
		...readJsonArray(path.join(dir, `${packCode}_encounter.json`)),
		...readJsonArray(path.join(dir, `${packCode}.json`)),
	];

	const byCode = new Map<string, BoxCard>();
	for (const card of cards) {
		if (!card.encounter_code || !card.code || byCode.has(card.code)) {
			continue;
		}
		byCode.set(card.code, card);
	}
	return [...byCode.values()];
};

const loadProductEncounterCards = (
	story: IDatabase.Story,
	packs: ICache.Pack[] = Cache.getPacks(),
): BoxCard[] => {
	const packCodes = new Set(story.pack_codes ?? []);
	if (story.pack_code) {
		packCodes.add(story.pack_code);
	}
	const cycleCode = story.cycle_code;
	const allowCycleMatch =
		Boolean(cycleCode) && !HOBBY_GAMES_SHARED_CYCLES.has(cycleCode as string);

	const selectedPacks = packs.filter(
		(pack) =>
			packCodes.has(pack.code) ||
			(allowCycleMatch && pack.cycle_code === cycleCode),
	);

	const byCode = new Map<string, BoxCard>();
	for (const pack of selectedPacks) {
		for (const card of loadLocalPackEncounterCards(
			pack.cycle_code,
			pack.code,
		)) {
			if (!byCode.has(card.code)) {
				byCode.set(card.code, card);
			}
		}
	}
	return [...byCode.values()];
};

const sizeFromPackEncounterCache = (
	story: IDatabase.Story,
	packEncounterSets: ICache.PackEncounterSet[],
	databaseEncounterSets: IDatabase.EncounterSet[],
): CampaignProductSize => {
	const packCodes = new Set(story.pack_codes ?? []);
	if (story.pack_code) {
		packCodes.add(story.pack_code);
	}
	const cycleCode = story.cycle_code;
	const allowCycleMatch =
		Boolean(cycleCode) && !HOBBY_GAMES_SHARED_CYCLES.has(cycleCode as string);

	const sizeBySet = new Map<string, number>();

	for (const entry of packEncounterSets) {
		const matchesPack = packCodes.has(entry.pack_code);
		const matchesCycle = allowCycleMatch && entry.cycle_code === cycleCode;
		if (!matchesPack && !matchesCycle) {
			continue;
		}
		const prev = sizeBySet.get(entry.encounter_set_code) ?? 0;
		const size = entry.size ?? 0;
		if (size > prev) {
			sizeBySet.set(entry.encounter_set_code, size);
		}
	}

	if (sizeBySet.size === 0) {
		for (const entry of databaseEncounterSets) {
			const matchesPack =
				Boolean(entry.pack_code) && packCodes.has(entry.pack_code);
			const matchesCycle = allowCycleMatch && entry.cycle_code === cycleCode;
			if (!matchesPack && !matchesCycle) {
				continue;
			}
			const prev = sizeBySet.get(entry.code) ?? 0;
			const size = entry.size ?? 0;
			if (size > prev) {
				sizeBySet.set(entry.code, size);
			}
		}
	}

	const setCodes = [...sizeBySet.keys()].sort();
	const total = setCodes.reduce(
		(sum, code) => sum + (sizeBySet.get(code) ?? 0),
		0,
	);

	return {
		total,
		setCount: setCodes.length,
		setCodes,
	};
};

/**
 * Sum of encounter cards in a story's retail product box (Hobby Games totals).
 *
 * Prefers a retail box count from local ArkhamDB pack JSON (dedupes cross-set
 * double-sided links, keeps shared-back marketing counts). Falls back to cached
 * encounter-set sizes when downloads are missing.
 */
export const getCampaignProductSize = (
	story: IDatabase.Story,
	packEncounterSets: ICache.PackEncounterSet[] = Cache.getPackEncounterSets(),
	databaseEncounterSets: IDatabase.EncounterSet[] = Cache.getDatabaseEncounterSets(),
): CampaignProductSize => {
	const localCards = loadProductEncounterCards(story);

	if (localCards.length > 0) {
		const encounterCodes = [
			...new Set(
				localCards
					.map((card) => card.encounter_code)
					.filter((code): code is string => Boolean(code)),
			),
		].sort();

		return {
			total: getRetailBoxCardCount(localCards),
			setCount: encounterCodes.length,
			setCodes: encounterCodes,
		};
	}

	return sizeFromPackEncounterCache(
		story,
		packEncounterSets,
		databaseEncounterSets,
	);
};
