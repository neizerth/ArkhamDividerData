import * as API from "@/api/arkhamDB/api";
import type { IArkhamDB } from "@/types/arkhamDB";
import { ICache } from "@/types/cache";
import * as Cache from "@/util/cache";
import { groupBy, isNotNil, prop, propEq, uniq, uniqBy } from "ramda";

export const getPackEncounterSets = async (): Promise<
	ICache.PackEncounterSet[]
> => {
	const packs = Cache.getPacks();
	const arkhamDBPacks = packs.filter(propEq(ICache.Source.ARKHAMDB, "source"));

	const data = [];
	for (const pack of arkhamDBPacks) {
		data.push(...(await getEncounterSets(pack)));
	}

	return data;
};

const getEncounterSets = async (pack: ICache.Pack) => {
	console.log(`loading pack ${pack.cycle_code}/${pack.code} cards...`);
	const { code, cycle_code } = pack;

	const encounterCards = await API.loadJSONPackEncounterCards(cycle_code, code);
	const packCards = await API.loadJSONPackCards(cycle_code, code);

	const cards = [...encounterCards, ...packCards];

	const encounters = cards.filter(
		(card): card is IArkhamDB.JSON.Card & { encounter_code: string } =>
			Boolean(card.encounter_code),
	);

	const groups = groupBy(
		(card) => card.encounter_code,
		encounters,
	);

	return Object.entries(groups).map(([encounter_set_code, groupCards = []]) => {
		const types = getEncounterSetTypes(groupCards);
		const size = types.reduce((total, { size }) => total + size, 0);
		return {
			pack_code: code,
			cycle_code,
			source: ICache.Source.ARKHAMDB,
			encounter_set_code,
			size,
			types,
		};
	});
};

/** Physical card id: double-sided faces share one slot via ArkhamDB `back_link`. */
const getPhysicalCardId = (card: IArkhamDB.JSON.Card): string =>
	card.back_link ?? card.code;

const MAIN_TYPES = ["scenario", "agenda", "act"] as const;

const isMainType = (type: string) =>
	(MAIN_TYPES as readonly string[]).includes(type);

const mainTypePriority = (type: string) => {
	const index = (MAIN_TYPES as readonly string[]).indexOf(type);
	return index === -1 ? MAIN_TYPES.length : index;
};

/**
 * Front face of a double-sided card: prefer act/agenda/scenario if present,
 * otherwise the primary ArkhamDB code (`03065` over `03065b`, `…a` over `…b`).
 */
const pickCanonicalFace = (faces: IArkhamDB.JSON.Card[]) => {
	const mainFaces = faces.filter(({ type_code }) => isMainType(type_code));
	if (mainFaces.length > 0) {
		return [...mainFaces].sort(
			(a, b) => mainTypePriority(a.type_code) - mainTypePriority(b.type_code),
		)[0];
	}

	return [...faces].sort((a, b) => a.code.localeCompare(b.code))[0];
};

const typeSortOrder = (type: string) => {
	const preferred = [
		"scenario",
		"agenda",
		"act",
		"location",
		"enemy",
		"asset",
		"treachery",
		"story",
	];
	const index = preferred.indexOf(type);
	return index === -1 ? preferred.length : index;
};

export const getEncounterSetTypes = (cards: IArkhamDB.JSON.Card[]) => {
	const byPhysicalId = groupBy(getPhysicalCardId, cards);

	const canonicalCards = Object.entries(byPhysicalId)
		.map(([, faces = []]) => pickCanonicalFace(faces))
		.filter(isNotNil);

	const types = uniq(canonicalCards.map(prop("type_code")).filter(isNotNil)).sort(
		(a, b) => typeSortOrder(a) - typeSortOrder(b),
	);

	return types
		.map((type) => {
			const data = uniqBy(
				getPhysicalCardId,
				canonicalCards.filter(propEq(type, "type_code")),
			);

			const size = data.reduce((total, { quantity }) => total + quantity, 0);

			const cardCounts = data.reduce<Record<number, number>>(
				(acc, { position, quantity }) => {
					acc[position] = (acc[position] ?? 0) + quantity;
					return acc;
				},
				{},
			);

			return {
				type,
				size,
				cards: cardCounts,
			};
		})
		.filter(({ size }) => size > 0);
};
