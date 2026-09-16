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
