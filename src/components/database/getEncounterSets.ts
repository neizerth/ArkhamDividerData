import * as ArkhamCards from "@/components/arkhamCards/database";
import * as ArkhamDB from "@/components/arkhamDB/database";
import type { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import { sanitizeEncounterSynonyms } from "@/util/common";
import { createEncounterCanonicalLookup } from "@/util/encounterCanonical";
import { groupBy, isNotNil, values } from "ramda";

const sizeOf = (entry: Pick<IDatabase.EncounterSet, "size">) => entry.size ?? 0;

/** Merge encounter-set rows; keep the larger size (and its types) when both have one. */
const mergeEncounterSetGroup = (
	entries: IDatabase.EncounterSet[],
): IDatabase.EncounterSet =>
	entries.reduce((acc, entry) => {
		const merged = { ...acc, ...entry };

		if (sizeOf(acc) > sizeOf(entry)) {
			merged.size = acc.size;
			merged.types = acc.types ?? entry.types;
		} else if (sizeOf(entry) > sizeOf(acc)) {
			merged.size = entry.size;
			merged.types = entry.types ?? acc.types;
		}

		return merged;
	});

/*
  pack_code and cycle_code linking to encounter sets
  ArkhamDB: just find right PackEncounterSets entities
  ArkhamCards: append rest of data and exclude encounters with already set pack_code
*/
export const getEncounterSets = (): IDatabase.EncounterSet[] => {
	const data = [];

	console.log("caching Arkham Cards database encounter sets...");
	data.push(...ArkhamCards.getEncounterSets());

	console.log("caching ArkhamDB database encounter sets...");
	data.push(...ArkhamDB.getEncounterSets());

	const definitions = Cache.getEncounterSets();
	const canonicalize = createEncounterCanonicalLookup(definitions);

	// Collapse pack-local aliases (e.g. scenario `sewers` + ArkhamDB `arkham_sewers`).
	const groups = groupBy(
		(entry) => `${entry.pack_code}::${canonicalize(entry.code)}`,
		data,
	);

	const groupValues = values(groups).filter(isNotNil);
	return groupValues.map((group) => {
		const merged = mergeEncounterSetGroup(group);
		const code = canonicalize(merged.code);
		const definition = definitions.find(
			(entry) => entry.code === code || entry.synonyms.includes(code),
		);

		return {
			...merged,
			code,
			synonyms: sanitizeEncounterSynonyms(
				code,
				definition?.synonyms ?? merged.synonyms ?? [],
			),
		};
	});
};
