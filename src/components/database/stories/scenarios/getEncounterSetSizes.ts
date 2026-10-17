import type { IDatabase } from "@/types/database";

type SubtextRule = {
	code: string;
	pattern: RegExp;
	size: number;
	types: IDatabase.EncounterSetType[];
};

const TYPE_SORT_ORDER = [
	"scenario",
	"agenda",
	"act",
	"location",
	"enemy",
	"asset",
	"treachery",
	"story",
];

const typeSortIndex = (type: string) => {
	const index = TYPE_SORT_ORDER.indexOf(type);
	return index === -1 ? TYPE_SORT_ORDER.length : index;
};

/**
 * Rules matching ArkhamCards setup step `subtext` instructions that gather
 * only a subset of cards from an encounter set.
 * Order matters for `arkham`: more specific rules (locations + treacheries,
 * 5 treacheries + 5 named locations) come before single-type rules.
 */
const SUBTEXT_PARTIAL_SIZE_RULES: SubtextRule[] = [
	{
		// e.g. TFA / RTTFA / Bad Blood: "5 treachery cards ... and the following locations: Northside, Downtown (First Bank of Arkham), Easttown, Miskatonic University, and Rivertown"
		code: "arkham",
		pattern: /5 treachery cards[\s\S]*following locations:\s*Northside/i,
		size: 10,
		types: [
			{
				type: "location",
				size: 5,
				cards: {
					125: 1,
					129: 1,
					130: 1,
					132: 1,
					134: 1,
				},
			},
			{
				type: "treachery",
				size: 5,
				cards: {
					135: 3,
					136: 2,
				},
			},
		],
	},
	{
		// e.g. TDC The Doom of Arkham Part I: "only gather the location and treachery cards"
		code: "arkham",
		pattern: /only gather the location and treachery cards/i,
		size: 16,
		types: [
			{
				type: "location",
				size: 11,
				cards: {
					124: 1,
					125: 1,
					126: 1,
					127: 1,
					128: 1,
					129: 1,
					130: 1,
					131: 1,
					132: 1,
					133: 1,
					134: 1,
				},
			},
			{
				type: "treachery",
				size: 5,
				cards: {
					135: 3,
					136: 2,
				},
			},
		],
	},
	{
		// e.g. TDC One Last Job & The Doom of Arkham Part II: "only gather the location cards"
		code: "arkham",
		pattern: /only gather the location cards/i,
		size: 11,
		types: [
			{
				type: "location",
				size: 11,
				cards: {
					124: 1,
					125: 1,
					126: 1,
					127: 1,
					128: 1,
					129: 1,
					130: 1,
					131: 1,
					132: 1,
					133: 1,
					134: 1,
				},
			},
		],
	},
	{
		// e.g. PTC / TCU / TIC / TSK / FHV / AON / RTR / ROP / ZAU: "only gather the (5|five)? treachery cards"
		code: "arkham",
		pattern: /only gather the (?:(?:5|five) )?treachery cards/i,
		size: 5,
		types: [
			{
				type: "treachery",
				size: 5,
				cards: {
					135: 3,
					136: 2,
				},
			},
		],
	},
	{
		// e.g. ZCP Night on the Town: 'When gathering cards from The Midnight Masks, use only the copies of "Hunting Shadow"'
		code: "arkham",
		pattern: /Midnight Masks[\s\S]*only the copies of "Hunting Shadow"/i,
		size: 3,
		types: [
			{
				type: "treachery",
				size: 3,
				cards: {
					135: 3,
				},
			},
		],
	},
	{
		// e.g. TCU / RTTCU The Witching Hour: "only gather the 6 Arkham Woods locations"
		code: "tentacles",
		pattern: /only gather the 6 Arkham Woods locations/i,
		size: 6,
		types: [
			{
				type: "location",
				size: 6,
				cards: {
					150: 1,
					151: 1,
					152: 1,
					153: 1,
					154: 1,
					155: 1,
				},
			},
		],
	},
	{
		// e.g. EOE The Heart of Madness Part II / TSK Congress of the Keys: "only gather (the following cards )?(2x Dissonant Voices and 2x Frozen in Fear|2x Frozen in Fear and 2x Dissonant Voices)"
		code: "striking_fear",
		pattern: /Striking Fear[\s\S]*do not gather 3x Rotting Remains/i,
		size: 4,
		types: [
			{
				type: "treachery",
				size: 4,
				cards: {
					164: 2,
					165: 2,
				},
			},
		],
	},
	{
		// e.g. TCU / RTTCU Disappearance at the Twilight Estate: "only gather the seven [[Spectral]] locations"
		code: "at_deaths_doorstep",
		pattern: /only gather the seven \[\[Spectral\]\] locations/i,
		size: 7,
		types: [
			{
				type: "location",
				size: 7,
				cards: {
					78: 1,
					79: 1,
					80: 1,
					81: 1,
					82: 1,
					83: 1,
					84: 1,
				},
			},
		],
	},
	{
		// e.g. TDC The Apiary (v.II): "only gather the Infected Star Spawn enemy"
		code: "star_spawn",
		pattern: /only gather the Infected Star Spawn enemy/i,
		size: 1,
		types: [
			{
				type: "enemy",
				size: 1,
				cards: {
					226: 1,
				},
			},
		],
	},
	{
		// e.g. COB Blood Money: "only gather the three copies of Sanguine Cultist and the Blood-Crazed Zealot enemies"
		code: "sanguine_secrets",
		pattern:
			/Sanguine Secrets[\s\S]*Do not gather the Morbid Rituals treacheries/i,
		size: 4,
		types: [
			{
				type: "enemy",
				size: 4,
				cards: {
					112: 3,
					113: 1,
				},
			},
		],
	},
	{
		// e.g. ZDM The Machine in Yellow: "When gathering the Curtain Call encounter set, only gather the locations."
		code: "curtain_call",
		pattern: /Curtain Call[\s\S]*only gather the locations/i,
		size: 10,
		types: [
			{
				type: "location",
				size: 10,
				cards: {
					49: 1,
					50: 1,
					51: 1,
					52: 1,
					53: 1,
					54: 1,
					55: 1,
					56: 1,
					57: 1,
					58: 1,
				},
			},
		],
	},
];

const mergeEncounterSetTypes = (
	typesList: IDatabase.EncounterSetType[][],
): IDatabase.EncounterSetType[] => {
	const byType = new Map<string, Map<number, number>>();
	const fallbackTypeSizes = new Map<string, number>();

	for (const types of typesList) {
		for (const item of types) {
			if (item.cards && Object.keys(item.cards).length > 0) {
				let cardMap = byType.get(item.type);
				if (!cardMap) {
					cardMap = new Map<number, number>();
					byType.set(item.type, cardMap);
				}
				for (const [posStr, qty] of Object.entries(item.cards)) {
					const pos = Number(posStr);
					const prev = cardMap.get(pos) ?? 0;
					if (qty > prev) {
						cardMap.set(pos, qty);
					}
				}
			} else {
				const prev = fallbackTypeSizes.get(item.type) ?? 0;
				if (item.size > prev) {
					fallbackTypeSizes.set(item.type, item.size);
				}
			}
		}
	}

	const allTypes = new Set([...byType.keys(), ...fallbackTypeSizes.keys()]);
	const sortedTypes = [...allTypes].sort(
		(a, b) => typeSortIndex(a) - typeSortIndex(b),
	);

	return sortedTypes.map((type) => {
		const cardMap = byType.get(type);
		if (cardMap && cardMap.size > 0) {
			const sortedPositions = [...cardMap.keys()].sort((a, b) => a - b);
			const cards: Record<number, number> = {};
			let size = 0;
			for (const pos of sortedPositions) {
				const qty = cardMap.get(pos) ?? 0;
				cards[pos] = qty;
				size += qty;
			}
			return {
				type,
				size,
				cards,
			};
		}
		return {
			type,
			size: fallbackTypeSizes.get(type) ?? 0,
		};
	});
};

export const getStepEncounterSetSizes = ({
	encounterSetCodes,
	subtext,
	encounterSets,
}: {
	encounterSetCodes: string[];
	subtext?: string;
	encounterSets: IDatabase.EncounterSet[];
}): IDatabase.EncounterSetData[] => {
	if (!subtext) {
		return [];
	}

	const codeSet = new Set(encounterSetCodes);
	const result = new Map<string, IDatabase.EncounterSetData>();

	for (const rule of SUBTEXT_PARTIAL_SIZE_RULES) {
		if (!codeSet.has(rule.code) || result.has(rule.code)) {
			continue;
		}
		if (!rule.pattern.test(subtext)) {
			continue;
		}

		const dbSet = encounterSets.find((item) => item.code === rule.code);
		const fullSize = dbSet?.size;
		if (!fullSize || fullSize === rule.size) {
			continue;
		}

		result.set(rule.code, {
			code: rule.code,
			size: rule.size,
			full_size: fullSize,
			types: rule.types,
		});
	}

	return [...result.values()];
};

/**
 * Aggregates partial encounter set data across multiple groups/scenarios.
 * If an encounter set is used with its full size in at least one group/scenario
 * (and is not restricted in every group where it appears), or if different subsets
 * of the same set are used across scenarios (like `arkham` in TDC using 11 locations
 * in one scenario and 11 locations + 5 treacheries = 16 in another), merges the card
 * types/numbers and only emits an entry when `size < full_size`.
 */
export const mergeScenarioEncounterSetSizes = ({
	groups,
	encounterSets,
}: {
	groups: Array<{
		encounter_sets: string[];
		encounter_set_data?: IDatabase.EncounterSetData[];
	}>;
	encounterSets: IDatabase.EncounterSet[];
}): IDatabase.EncounterSetData[] => {
	if (groups.length === 0) {
		return [];
	}

	const partialByGroup = groups.map(
		(group) =>
			new Map(
				(group.encounter_set_data ?? []).map((item) => [item.code, item]),
			),
	);

	const candidateCodes = new Set(
		groups.flatMap((group) =>
			(group.encounter_set_data ?? []).map((item) => item.code),
		),
	);

	const result: IDatabase.EncounterSetData[] = [];

	for (const code of candidateCodes) {
		const dbSet = encounterSets.find((item) => item.code === code);
		const fullSize = dbSet?.size;
		if (!fullSize) {
			continue;
		}

		let usedFullInAnyGroup = false;
		const partialEntries: IDatabase.EncounterSetData[] = [];

		for (let i = 0; i < groups.length; i++) {
			const group = groups[i];
			if (!group.encounter_sets.includes(code)) {
				continue;
			}
			const partial = partialByGroup[i].get(code);
			if (!partial) {
				usedFullInAnyGroup = true;
				break;
			}
			partialEntries.push(partial);
		}

		if (usedFullInAnyGroup || partialEntries.length === 0) {
			continue;
		}

		const mergedTypes = mergeEncounterSetTypes(
			partialEntries
				.map((entry) => entry.types)
				.filter((types): types is IDatabase.EncounterSetType[] =>
					Boolean(types && types.length > 0),
				),
		);

		const mergedSize =
			mergedTypes.length > 0
				? mergedTypes.reduce((sum, item) => sum + item.size, 0)
				: Math.max(...partialEntries.map((entry) => entry.size));

		if (mergedSize > 0 && mergedSize < fullSize) {
			result.push({
				code,
				size: mergedSize,
				full_size: fullSize,
				...(mergedTypes.length > 0 ? { types: mergedTypes } : {}),
			});
		}
	}

	return result;
};

export const getStoryEncounterSetSizes = ({
	scenarios,
	encounterSets,
}: {
	scenarios: IDatabase.StoryScenario[];
	encounterSets: IDatabase.EncounterSet[];
}): IDatabase.EncounterSetData[] => {
	const dedicatedScenarioCodes = new Set(
		scenarios.flatMap((scenario) => {
			const codes = [scenario.id];
			const byIcon = encounterSets.find(
				(set) => set.icon && set.icon === scenario.icon,
			);
			if (byIcon) {
				codes.push(byIcon.code);
			}
			return codes;
		}),
	);

	return mergeScenarioEncounterSetSizes({
		groups: scenarios.map((scenario) => ({
			encounter_sets: [
				...(scenario.encounter_sets ?? []),
				...(scenario.extra_encounter_sets ?? []),
			],
			encounter_set_data: scenario.encounter_set_data,
		})),
		encounterSets,
	}).filter((item) => !dedicatedScenarioCodes.has(item.code));
};
