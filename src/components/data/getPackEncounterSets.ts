import * as ArkhamBuild from "@/components/arkhamBuild";
import * as ArkhamBuildFan from "@/components/arkhamBuildFan";
import * as ArkhamCards from "@/components/arkhamCards";
import * as ArkhamDB from "@/components/arkhamDB";
import type { ICache } from "@/types/cache";

const encounterKey = ({
	pack_code,
	encounter_set_code,
}: Pick<ICache.PackEncounterSet, "pack_code" | "encounter_set_code">) =>
	`${pack_code}::${encounter_set_code}`;

const sizeOf = (entry: ICache.PackEncounterSet) => entry.size ?? 0;

/**
 * Prefer ArkhamDB / Arkham Cards rows; fill missing/zero sizes from fallbacks,
 * and replace when the fallback reports a larger size for the same set.
 * Encounter sets that exist only in the fallback are appended.
 */
export const mergePackEncounterSets = (
	primary: ICache.PackEncounterSet[],
	fallback: ICache.PackEncounterSet[],
): ICache.PackEncounterSet[] => {
	const byKey = new Map(
		primary.map((entry) => [encounterKey(entry), entry] as const),
	);
	const ownedCodes = new Set(primary.map((entry) => entry.encounter_set_code));

	for (const entry of fallback) {
		const key = encounterKey(entry);
		const current = byKey.get(key);

		if (!current) {
			// Do not let name-matched fallback sets claim an encounter_set_code
			// that already belongs to another pack (e.g. fan sets named "The Bayou",
			// "Curse of the Rougarou", or "Waking Nightmare").
			if (ownedCodes.has(entry.encounter_set_code)) {
				continue;
			}
			byKey.set(key, entry);
			ownedCodes.add(entry.encounter_set_code);
			continue;
		}

		if (!entry.size || sizeOf(entry) <= sizeOf(current)) {
			continue;
		}

		byKey.set(key, {
			...current,
			size: entry.size,
			types: entry.types ?? current.types,
		});
	}

	return [...byKey.values()];
};

/*
  Gets encounter sets per pack
  Due to Arkham Cards hasn't all encounters we can't take this data 
*/
export const getPackEncounterSets = async (): Promise<
	ICache.PackEncounterSet[]
> => {
	const data: ICache.PackEncounterSet[] = [];

	console.log("loading ArkhamDB pack encounter sets...");
	data.push(...(await ArkhamDB.getPackEncounterSets()));

	console.log("loading Arkham Cards pack encounter sets...");
	data.push(...(await ArkhamCards.getPackEncounterSets()));

	console.log("loading Arkham Build pack encounter sets (size fallback)...");
	const withBuild = mergePackEncounterSets(
		data,
		await ArkhamBuild.getPackEncounterSets(),
	);

	console.log("loading Fan Content pack encounter sets (size fallback)...");
	return mergePackEncounterSets(
		withBuild,
		await ArkhamBuildFan.getPackEncounterSets(),
	);
};
