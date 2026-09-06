import { ARKHAM_BUILD_API_BASE_URL } from "@/config/api";
import { CACHE_DIR } from "@/config/app";
import type { IArkhamBuild } from "@/types/arkhamBuild";
import { createExistsChecker, createJSONReader, createJSONWriter, mkDir } from "@/util/fs";
import path from "path";
import { getWithPrefix } from "../request";
import {
	type ArkhamBuildLanguage,
	resolveArkhamBuildLanguage,
} from "./constants";

const CARDS_CACHE_DIR = path.join(CACHE_DIR, "arkham-build", "cards");

const getApi = () => getWithPrefix(ARKHAM_BUILD_API_BASE_URL);
const writeCardsCache = createJSONWriter(CARDS_CACHE_DIR);
const readCardsCache = createJSONReader(CARDS_CACHE_DIR);
const cardsCacheExists = createExistsChecker({
	dir: CARDS_CACHE_DIR,
	extension: "json",
});

export const loadCards = async (
	language: string,
	{ useCache = true }: { useCache?: boolean } = {},
): Promise<IArkhamBuild.Card[]> => {
	const resolved = resolveArkhamBuildLanguage(language);
	if (!resolved) {
		return [];
	}

	if (useCache && cardsCacheExists(resolved)) {
		console.log(`loading Arkham Build cards from cache (${resolved})...`);
		return readCardsCache<IArkhamBuild.Card[]>(resolved);
	}

	console.log(`loading Arkham Build cards (${resolved})...`);
	const { data } = await getApi()<IArkhamBuild.CardsResponse>(
		`/v1/cache/cards/${resolved}`,
	);

	const cards = data.data.all_card;
	mkDir(CARDS_CACHE_DIR);
	writeCardsCache(resolved, cards);
	return cards;
};

export const loadInvestigators = async (
	language: string,
): Promise<IArkhamBuild.Investigator[]> => {
	const cards = await loadCards(language);
	return cards.filter(
		(card): card is IArkhamBuild.Investigator =>
			card.type_code === "investigator",
	);
};

export type { ArkhamBuildLanguage };
