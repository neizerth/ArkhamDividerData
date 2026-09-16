/** Compact alphanumeric form for fuzzy name comparison. */
export const compactName = (name: string): string =>
	name.toLowerCase().replace(/[^a-z0-9]/g, "");

const PROJECT_SUFFIXES = [
	"campaignexpansion",
	"investigatorexpansion",
	"expansion",
] as const;

/** Story / project key: drop leading "the" and expansion suffixes. */
export const projectMatchKey = (name: string): string => {
	let key = compactName(name).replace(/^the/, "");

	for (const suffix of PROJECT_SUFFIXES) {
		if (key.endsWith(suffix)) {
			key = key.slice(0, -suffix.length);
			break;
		}
	}

	return key;
};

/** Encounter-set key: drop leading "the". */
export const encounterMatchKey = (name: string): string =>
	compactName(name).replace(/^the/, "");

const ENCOUNTER_PREFIXES = ["orderofthe", "orderof"] as const;

/**
 * True when keys are equal or differ only by a known harmless prefix
 * (e.g. "Order of the Fellowship..." vs "Fellowship...").
 */
export const encounterKeysMatch = (a: string, b: string): boolean => {
	if (a === b) {
		return true;
	}

	const [longer, shorter] = a.length >= b.length ? [a, b] : [b, a];
	if (!longer.endsWith(shorter)) {
		return false;
	}

	const prefix = longer.slice(0, -shorter.length);
	return (ENCOUNTER_PREFIXES as readonly string[]).includes(prefix);
};
