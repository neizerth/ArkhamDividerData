import type { IDatabase } from "@/types/database";
import { whereSynonyms } from "@/util/criteria";

/** True when every encounter code has a positive size in the database cache. */
export const hasFullEncounterSizes = (
	codes: string[],
	encounterSets: IDatabase.EncounterSet[],
): boolean => {
	if (codes.length === 0) {
		return false;
	}

	return codes.every((code) => {
		const set = encounterSets.find(whereSynonyms(code));
		return Boolean(set?.size && set.size > 0);
	});
};

/** Minimum pack card number (position) across encounter-type card maps. */
export const getMinCardNumberFromTypes = (
	types?: Array<{ cards?: Record<number, number> }>,
): number | undefined => {
	if (!types?.length) {
		return undefined;
	}

	let min: number | undefined;
	for (const { cards } of types) {
		if (!cards) {
			continue;
		}
		for (const key of Object.keys(cards)) {
			const position = Number(key);
			if (!Number.isFinite(position)) {
				continue;
			}
			if (min === undefined || position < min) {
				min = position;
			}
		}
	}
	return min;
};

/** Minimum among defined numbers; undefined when none are present. */
export const minDefined = (
	...values: Array<number | undefined | null>
): number | undefined => {
	let min: number | undefined;
	for (const value of values) {
		if (value == null) {
			continue;
		}
		if (min === undefined || value < min) {
			min = value;
		}
	}
	return min;
};

/** Minimum min_card_number across encounter sets matched by code. */
export const getMinCardNumberForCodes = (
	codes: string[],
	encounterSets: IDatabase.EncounterSet[],
): number | undefined =>
	minDefined(
		...codes.map(
			(code) => encounterSets.find(whereSynonyms(code))?.min_card_number,
		),
	);
