import * as API from "@/api/arkhamBuild/api";
import type { ICache } from "@/types/cache";
import * as Cache from "@/util/cache";

/**
 * Investigators from arkham.build that are missing from other sources.
 * Useful when a pack lands in arkham.build before ArkhamDB / Arkham Cards.
 */
export const getPackInvestigators = async (
	existing: ICache.PackInvestigator[] = [],
): Promise<ICache.PackInvestigator[]> => {
	const packs = Cache.getPacks();
	const existingCodes = new Set(existing.map((investigator) => investigator.code));

	const investigators = await API.loadInvestigators("en");
	const packByCode = new Map(packs.map((pack) => [pack.code, pack]));

	return investigators
		.filter((investigator) => !existingCodes.has(investigator.code))
		.flatMap((investigator) => {
			const pack = packByCode.get(investigator.pack_code);
			if (!pack) {
				return [];
			}

			return [
				{
					code: investigator.code,
					position: investigator.position,
					cycle_code: pack.cycle_code,
					pack_code: investigator.pack_code,
					faction_code: investigator.faction_code,
					name: investigator.real_name,
					real_name: investigator.real_name,
					subname: investigator.real_subname,
					alternate_of: investigator.alternate_of_code,
				} satisfies ICache.PackInvestigator,
			];
		});
};

export const getSupportedPackCodes = async (): Promise<string[]> => {
	const cards = await API.loadCards("en");
	return [...new Set(cards.map((card) => card.pack_code))];
};
