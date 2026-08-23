import type { IArkhamCards } from "@/types/arkhamCards";
import type { IArkhamDB } from "@/types/arkhamDB";
import { groupBy, uniq } from "ramda";

type EncounterCard = IArkhamDB.JSON.Card & { encounter_code: string };

type EncounterDefinition = {
	code: string;
	name: string;
	synonyms: string[];
};

const SPECIAL_GROUP_NAMES = ["Epic Multiplayer", "Single Group"];

const isEncounterSetStep = (step: IArkhamCards.JSON.ScenarioStep) =>
	step.type === "encounter_sets";

const isDefaultGatherStep = (step: IArkhamCards.JSON.ScenarioStep) =>
	step.id.startsWith("gather_encounter_sets");

const countPackCards = (cards: EncounterCard[], code: string) =>
	cards.filter((card) => card.encounter_code === code).length;

const createPackEncounterCodeResolver = (
	packCodes: Set<string>,
	definitions: EncounterDefinition[],
) => {
	const resolveToPackCode = (code: string): string | null => {
		if (packCodes.has(code)) {
			return code;
		}

		for (const def of definitions) {
			const aliases = new Set([def.code, ...def.synonyms]);
			if (!aliases.has(code)) {
				continue;
			}

			const packAlias = [...aliases].find((alias) => packCodes.has(alias));
			if (packAlias) {
				return packAlias;
			}
		}

		const source = definitions.find(
			(def) => def.code === code || def.synonyms.includes(code),
		);

		if (source && SPECIAL_GROUP_NAMES.includes(source.name)) {
			for (const def of definitions) {
				if (def.name !== source.name) {
					continue;
				}

				const packAlias = [def.code, ...def.synonyms].find((alias) =>
					packCodes.has(alias),
				);
				if (packAlias) {
					return packAlias;
				}
			}
		}

		return null;
	};

	const resolveStepCodes = (codes: string[]) =>
		uniq(
			codes
				.map(resolveToPackCode)
				.filter((code): code is string => Boolean(code)),
		);

	return { resolveToPackCode, resolveStepCodes };
};

const pickParentCode = (
	codes: string[],
	cards: EncounterCard[],
	scenarioId?: string,
) => {
	if (scenarioId && codes.includes(scenarioId)) {
		return scenarioId;
	}

	return [...codes].sort(
		(a, b) => countPackCards(cards, b) - countPackCards(cards, a),
	)[0];
};

const buildPositionSharingGraph = (cards: EncounterCard[]) => {
	const graph = new Map<string, Set<string>>();

	const link = (a: string, b: string) => {
		if (!graph.has(a)) {
			graph.set(a, new Set());
		}
		if (!graph.has(b)) {
			graph.set(b, new Set());
		}
		graph.get(a)?.add(b);
		graph.get(b)?.add(a);
	};

	for (const group of Object.values(groupBy((card) => String(card.position), cards))) {
		const codes = uniq((group ?? []).map((card) => card.encounter_code));
		for (let i = 0; i < codes.length; i += 1) {
			for (let j = i + 1; j < codes.length; j += 1) {
				link(codes[i], codes[j]);
			}
		}
	}

	return graph;
};

const areConnected = (codes: string[], graph: Map<string, Set<string>>) => {
	if (codes.length < 2) {
		return false;
	}

	const visited = new Set<string>();
	const queue = [codes[0]];
	visited.add(codes[0]);

	while (queue.length > 0) {
		const current = queue.pop();
		if (!current) {
			continue;
		}

		for (const neighbor of graph.get(current) ?? []) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				queue.push(neighbor);
			}
		}
	}

	return codes.every((code) => visited.has(code));
};

const getConnectedComponents = (graph: Map<string, Set<string>>) => {
	const visited = new Set<string>();
	const components: string[][] = [];

	for (const node of graph.keys()) {
		if (visited.has(node)) {
			continue;
		}

		const component: string[] = [];
		const queue = [node];
		visited.add(node);

		while (queue.length > 0) {
			const current = queue.pop();
			if (!current) {
				continue;
			}

			component.push(current);

			for (const neighbor of graph.get(current) ?? []) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}

		components.push(component);
	}

	return components;
};

const addMerge = (
	plan: Map<string, Set<string>>,
	parent: string,
	variant: string,
) => {
	if (parent === variant) {
		return;
	}

	if (!plan.has(parent)) {
		plan.set(parent, new Set());
	}

	plan.get(parent)?.add(variant);
};

const getDefaultParentCode = (
	scenario: IArkhamCards.JSON.Scenario,
	cards: EncounterCard[],
	resolveStepCodes: (codes: string[]) => string[],
) => {
	const defaultCodes = resolveStepCodes(
		scenario.steps
			.filter(isEncounterSetStep)
			.filter(isDefaultGatherStep)
			.flatMap((step) => step.encounter_sets ?? []),
	);

	if (defaultCodes.length === 0) {
		return null;
	}

	return pickParentCode(defaultCodes, cards, scenario.id);
};

const getScenariosUsingPack = (
	campaigns: IArkhamCards.JSON.FullCampaign[],
	resolveToPackCode: (code: string) => string | null,
) => {
	const scenarios: IArkhamCards.JSON.Scenario[] = [];

	for (const { scenarios: campaignScenarios } of campaigns) {
		for (const scenario of campaignScenarios) {
			const stepCodes = uniq(
				scenario.steps
					.filter(isEncounterSetStep)
					.flatMap((step) => step.encounter_sets ?? []),
			);

			const usesPack =
				stepCodes.some((code) => resolveToPackCode(code) !== null) ||
				resolveToPackCode(scenario.id) !== null;

			if (usesPack) {
				scenarios.push(scenario);
			}
		}
	}

	return scenarios;
};

const applyScenarioStepMerges = ({
	plan,
	scenario,
	cards,
	positionGraph,
	resolveStepCodes,
}: {
	plan: Map<string, Set<string>>;
	scenario: IArkhamCards.JSON.Scenario;
	cards: EncounterCard[];
	positionGraph: Map<string, Set<string>>;
	resolveStepCodes: (codes: string[]) => string[];
}) => {
	const parent = getDefaultParentCode(scenario, cards, resolveStepCodes);
	if (!parent) {
		return;
	}

	for (const step of scenario.steps.filter(isEncounterSetStep)) {
		const stepCodes = resolveStepCodes(step.encounter_sets ?? []);

		if (stepCodes.length === 0) {
			continue;
		}

		if (stepCodes.includes(parent)) {
			for (const code of stepCodes) {
				addMerge(plan, parent, code);
			}
			continue;
		}

		if (!isDefaultGatherStep(step) && areConnected(stepCodes, positionGraph)) {
			for (const code of stepCodes) {
				addMerge(plan, parent, code);
			}
		}
	}
};

const isVariantInPlan = (code: string, plan: Map<string, Set<string>>) => {
	for (const variants of plan.values()) {
		if (variants.has(code)) {
			return true;
		}
	}

	return false;
};

const applySharedPositionMerges = ({
	plan,
	cards,
	positionGraph,
}: {
	plan: Map<string, Set<string>>;
	cards: EncounterCard[];
	positionGraph: Map<string, Set<string>>;
}) => {
	for (const cluster of getConnectedComponents(positionGraph)) {
		if (cluster.length < 2) {
			continue;
		}

		const unassigned = cluster.filter((code) => !isVariantInPlan(code, plan));
		if (unassigned.length < 2) {
			continue;
		}

		const parent = pickParentCode(unassigned, cards);
		for (const code of unassigned) {
			addMerge(plan, parent, code);
		}
	}
};

export const buildPackEncounterSetMergePlan = (
	cards: EncounterCard[],
	campaigns: IArkhamCards.JSON.FullCampaign[],
	encounterDefinitions: EncounterDefinition[] = [],
): Map<string, string[]> => {
	const packCodes = new Set(cards.map((card) => card.encounter_code));
	const { resolveToPackCode, resolveStepCodes } = createPackEncounterCodeResolver(
		packCodes,
		encounterDefinitions,
	);
	const plan = new Map<string, Set<string>>();
	const positionGraph = buildPositionSharingGraph(cards);
	const scenarios = getScenariosUsingPack(campaigns, resolveToPackCode);

	for (const scenario of scenarios) {
		applyScenarioStepMerges({
			plan,
			scenario,
			cards,
			positionGraph,
			resolveStepCodes,
		});
	}

	applySharedPositionMerges({ plan, cards, positionGraph });

	return new Map(
		[...plan.entries()].map(([parent, variants]) => [
			parent,
			[...variants].sort(),
		]),
	);
};

export const mergeEncounterSetGroups = (
	groups: Partial<Record<string, EncounterCard[]>>,
	mergePlan: Map<string, string[]>,
) => {
	for (const [parentCode, variantCodes] of mergePlan.entries()) {
		const parentCards = groups[parentCode];
		if (!parentCards) {
			continue;
		}

		const variantCards = variantCodes.flatMap((code) => groups[code] ?? []);
		if (variantCards.length === 0) {
			continue;
		}

		groups[parentCode] = [...parentCards, ...variantCards];
	}
};
