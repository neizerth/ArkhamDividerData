import * as API from "@/api/arkhamDB/api";
import type { IArkhamDB } from "@/types/arkhamDB";
import { ICache } from "@/types/cache";
import * as Cache from "@/util/cache";
import { groupBy, prop, toPairs, propEq, uniq, isNotNil, uniqBy } from "ramda";

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

	const encounters = cards.filter(({ encounter_code }) =>
		Boolean(encounter_code),
	);

	const groups = groupBy(prop("encounter_code"), encounters);

	return toPairs(groups).map(([encounter_set_code, cards = []]) => {
		const types = getEncounterSetTypes(cards);
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

export const getEncounterSetTypes = (cards: IArkhamDB.JSON.Card[]) => {
	const mainTypes = ["agenda", "act", "scenario"];

	const types = uniq(cards.map(prop("type_code")).filter(isNotNil));

	// Sort types to process mainTypes first
	const sortedTypes = [...types].sort((a, b) => {
		const aIsMain = mainTypes.includes(a);
		const bIsMain = mainTypes.includes(b);
		if (aIsMain && !bIsMain) return -1;
		if (!aIsMain && bIsMain) return 1;
		return 0;
	});

	const mainTypeCards = cards
		.filter(({ type_code }) => mainTypes.includes(type_code))
		.map(prop("position"));

	const usedCardPositions = new Set<number>();

	const typeData = sortedTypes.map((type) => {
		const typeCards = cards.filter(propEq(type, "type_code"));

		const data = uniqBy(
			prop("position"),
			typeCards.filter(({ position, type_code }) => {
				// Skip if card already used in another type
				if (usedCardPositions.has(position)) {
					return false;
				}
				// Keep main types or cards not in main types
				return (
					mainTypes.includes(type_code) || !mainTypeCards.includes(position)
				);
			}),
		);

		// Mark cards as used
		for (const { position } of data) {
			usedCardPositions.add(position);
		}

		const size = data.reduce((total, { quantity }) => total + quantity, 0);

		const cardCodes = data.map(prop("position"));

		return {
			type,
			size,
			cards: cardCodes,
		};
	});

	return typeData;
};
