import * as API from "@/api/arkhamBuild/api";
import { getEncounterSetTypes } from "@/components/arkhamDB/packs/getPackEncounterSets";
import type { IArkhamBuild } from "@/types/arkhamBuild";
import type { IArkhamDB } from "@/types/arkhamDB";
import { ICache } from "@/types/cache";
import * as Cache from "@/util/cache";
import {
	buildPackEncounterSetMergePlan,
	mergeEncounterSetGroups,
} from "@/util/encounterSetMerge";
import { groupBy } from "ramda";

const toEncounterCard = (
	card: IArkhamBuild.Card & { encounter_code: string },
): IArkhamDB.JSON.Card & { encounter_code: string } => ({
	code: card.code,
	name: card.real_name,
	position: card.position,
	pack_code: card.pack_code,
	type_code: card.type_code,
	quantity: card.quantity,
	encounter_code: card.encounter_code,
	encounter_position: card.encounter_position,
	faction_code: card.faction_code,
	back_link: card.back_link_id,
});

/**
 * Encounter-set sizes derived from arkham.build cards.
 * Used as a fallback when ArkhamDB / Arkham Cards omit size or report 0.
 */
export const getPackEncounterSets = async (): Promise<
	ICache.PackEncounterSet[]
> => {
	const packs = Cache.getPacks();
	const packByCode = new Map(packs.map((pack) => [pack.code, pack]));
	const cards = await API.loadCards("en");

	const encounters = cards.filter(
		(card): card is IArkhamBuild.Card & { encounter_code: string } =>
			Boolean(card.encounter_code),
	);

	const byPack = groupBy((card) => card.pack_code, encounters);
	const campaigns = Cache.getCampaigns();
	const encounterDefinitions = Cache.getEncounterSets();

	const result: ICache.PackEncounterSet[] = [];

	for (const [pack_code, packCards = []] of Object.entries(byPack)) {
		const pack = packByCode.get(pack_code);
		if (!pack) {
			continue;
		}

		const mapped = packCards.map(toEncounterCard);
		const groups = groupBy((card) => card.encounter_code, mapped);

		const mergePlan = buildPackEncounterSetMergePlan(
			mapped,
			campaigns,
			encounterDefinitions,
		);
		mergeEncounterSetGroups(groups, mergePlan);

		for (const [encounter_set_code, groupCards = []] of Object.entries(groups)) {
			const types = getEncounterSetTypes(groupCards);
			const size = types.reduce((total, { size: typeSize }) => total + typeSize, 0);

			result.push({
				pack_code,
				cycle_code: pack.cycle_code,
				source: ICache.Source.ARKHAM_BUILD,
				encounter_set_code,
				size,
				types,
			});
		}
	}

	return result;
};
