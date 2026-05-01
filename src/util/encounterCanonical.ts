import { uniq } from "ramda";

/**
 * Maps any encounter_set_code from definitions to a canonical primary `code`.
 * Duplicate definitions share the same name but different codes (e.g. ArkhamDB
 * `arkham_sewers` vs Arkham Cards-only `sewers`): synonyms must win over a
 * later bare `{ code: "sewers" }` row that would otherwise overwrite the alias.
 */
export const createEncounterCanonicalLookup = (
	definitions: { code: string; synonyms: string[] }[],
): ((code: string) => string) => {
	const map = new Map<string, string>();
	for (const { code, synonyms } of definitions) {
		for (const syn of synonyms) {
			map.set(syn, code);
		}
	}
	for (const { code } of definitions) {
		if (!map.has(code)) {
			map.set(code, code);
		}
	}
	return (raw: string) => map.get(raw) ?? raw;
};

export const normalizeEncounterCodes = (
	codes: string[],
	canonicalize: (code: string) => string,
): string[] => uniq(codes.map(canonicalize));
