import { getEncounterSetTypes } from "@/components/arkhamDB/packs/getPackEncounterSets";
import type { IArkhamBuildFan } from "@/types/arkhamBuildFan";
import type { IArkhamDB } from "@/types/arkhamDB";
import type { ICache } from "@/types/cache";
import { groupBy } from "ramda";
import {
	compactName,
	encounterKeysMatch,
	encounterMatchKey,
	projectMatchKey,
} from "./matchName";

export type EncounterSizeData = {
	size: number;
	types: ICache.EncounterSetType[];
};

export type NamedEncounter = {
	name: string;
};

const toEncounterCard = (
	card: IArkhamBuildFan.Card & { encounter_code: string },
): IArkhamDB.JSON.Card & { encounter_code: string } => ({
	code: card.code,
	name: card.name,
	position: card.position,
	pack_code: card.pack_code,
	type_code: card.type_code,
	quantity: card.quantity,
	encounter_code: card.encounter_code,
	encounter_position: card.encounter_position,
	faction_code: card.faction_code ?? "mythos",
	back_link: card.back_link_id,
});

export const getSizesByEncounterName = (
	project: IArkhamBuildFan.Project,
): Map<string, EncounterSizeData> => {
	const encounterCards = project.data.cards.filter(
		(card): card is IArkhamBuildFan.Card & { encounter_code: string } =>
			Boolean(card.encounter_code),
	);

	const byEncounter = groupBy((card) => card.encounter_code, encounterCards);
	const setByCode = new Map(
		project.data.encounter_sets.map((set) => [set.code, set]),
	);

	const sizes = new Map<string, EncounterSizeData>();

	for (const [encounterCode, cards = []] of Object.entries(byEncounter)) {
		const set = setByCode.get(encounterCode);
		if (!set) {
			continue;
		}

		const types = getEncounterSetTypes(cards.map(toEncounterCard));
		const size = types.reduce((total, { size: typeSize }) => total + typeSize, 0);

		if (size > 0) {
			sizes.set(encounterMatchKey(set.name), { size, types });
		}
	}

	return sizes;
};

export const findEncounterSize = (
	name: string,
	sizesByName: Map<string, EncounterSizeData>,
): EncounterSizeData | undefined => {
	const key = encounterMatchKey(name);
	const direct = sizesByName.get(key);
	if (direct) {
		return direct;
	}

	for (const [fanKey, data] of sizesByName) {
		if (encounterKeysMatch(key, fanKey)) {
			return data;
		}
	}

	return undefined;
};

const countEncounterOverlap = (
	encounterSets: NamedEncounter[],
	project: IArkhamBuildFan.Project,
): number => {
	const fanNames = project.data.encounter_sets.map((set) =>
		encounterMatchKey(set.name),
	);

	return encounterSets.filter((set) => {
		const key = encounterMatchKey(set.name);
		return fanNames.some((fanKey) => encounterKeysMatch(key, fanKey));
	}).length;
};

export type ProjectMatchOptions = {
	name: string;
	type?: string;
	encounterSets?: NamedEncounter[];
};

/**
 * Score a fan project against a pack/story name.
 * Prefer exact meta.name keys; require encounter overlap for fuzzy matches.
 */
export const scoreFanProject = (
	target: ProjectMatchOptions,
	project: IArkhamBuildFan.Project,
): number => {
	const storyKey = projectMatchKey(target.name);
	const projectKey = projectMatchKey(project.meta.name);

	if (!storyKey || !projectKey) {
		return 0;
	}

	const encounterSets = target.encounterSets ?? [];
	const overlap = countEncounterOverlap(encounterSets, project);

	let score = 0;

	if (storyKey === projectKey) {
		score += 100;
	} else if (
		(projectKey.startsWith(storyKey) || storyKey.startsWith(projectKey)) &&
		overlap > 0
	) {
		score += 70;
	} else if (
		encounterSets.length > 0 &&
		overlap >= Math.max(3, Math.ceil(encounterSets.length * 0.5))
	) {
		score += 40;
	} else {
		return 0;
	}

	const types = project.meta.types ?? [];
	const metaName = compactName(project.meta.name);
	const isInvestigatorExpansion = metaName.includes("investigatorexpansion");
	const isCampaignExpansion =
		types.includes("campaign") || metaName.includes("campaignexpansion");
	const isCampaignTarget = Boolean(target.type?.includes("campaign"));
	const isInvestigatorTarget = Boolean(
		target.type?.includes("investigator"),
	);

	if (isInvestigatorTarget) {
		if (!isInvestigatorExpansion) {
			return 0;
		}
		score += 30;
	} else if (isCampaignTarget || !target.type) {
		if (isCampaignExpansion) {
			score += 25;
		}
		if (isInvestigatorExpansion) {
			score -= 40;
		}
	}

	return score + overlap;
};

export const findFanProject = (
	target: ProjectMatchOptions,
	projects: IArkhamBuildFan.Project[],
): IArkhamBuildFan.Project | undefined => {
	const scored = projects
		.map((project) => ({
			project,
			score: scoreFanProject(target, project),
		}))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score);

	return scored[0]?.project;
};
