import { ownSetCodes } from "@/components/database/stories/scenarios/getDedicatedScenarioEncounterCodes";
import type { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import { showError, showInfo, showSuccess } from "@/util/console";
import { getAllCampaignValidationData } from "./getValidationData";
import { getCampaignProductSize } from "./hobbyGamesCounts/getCampaignProductSize";

export type ValidateBuildParams = {
	stories?: IDatabase.Story[];
	encounterSets?: IDatabase.EncounterSet[];
};

const diffCodes = (
	expected: string[],
	actual: string[],
): { missing: string[]; extra: string[] } => {
	const expectedSet = new Set(expected);
	const actualSet = new Set(actual);

	const missing = expected.filter((code) => !actualSet.has(code));
	const extra = actual.filter((code) => !expectedSet.has(code));

	return { missing, extra };
};

const formatDiffError = (
	scope: string,
	field: string,
	diff: { missing: string[]; extra: string[] },
): string | null => {
	if (diff.missing.length === 0 && diff.extra.length === 0) {
		return null;
	}
	const parts: string[] = [];
	if (diff.missing.length > 0) {
		parts.push(`missing [${diff.missing.join(", ")}]`);
	}
	if (diff.extra.length > 0) {
		parts.push(`extra [${diff.extra.join(", ")}]`);
	}
	return `[${scope}] ${field}: ${parts.join("; ")}`;
};

export const validateBuild = ({
	stories = Cache.getStories(),
	encounterSets = Cache.getDatabaseEncounterSets(),
}: ValidateBuildParams = {}): void => {
	const validationList = getAllCampaignValidationData();
	showInfo(
		`running validation quality gate for ${validationList.length} products...`,
	);

	const storyByCode = new Map(stories.map((story) => [story.code, story]));
	const encounterByCode = new Map(
		encounterSets.map((encounterSet) => [encounterSet.code, encounterSet]),
	);
	const packEncounterSets = Cache.getPackEncounterSets();

	const errors: string[] = [];

	for (const validation of validationList) {
		const { code } = validation;
		const story = storyByCode.get(code);

		if (!story) {
			errors.push(`[${code}] story not found in database`);
			continue;
		}

		// 1. Story-level encounter_sets, extra_encounter_sets, scenario_encounter_sets
		const expectedEncounterCodes = validation.encounter_sets.map(
			(item) => item.code,
		);
		const expectedExtraEncounterCodes = validation.extra_encounter_sets.map(
			(item) => item.code,
		);
		const expectedScenarioCodes = validation.scenarios.map((item) => item.code);

		const encDiffErr = formatDiffError(
			code,
			"encounter_sets",
			diffCodes(expectedEncounterCodes, story.encounter_sets),
		);
		if (encDiffErr) {
			errors.push(encDiffErr);
		}

		const extraDiffErr = formatDiffError(
			code,
			"extra_encounter_sets",
			diffCodes(expectedExtraEncounterCodes, story.extra_encounter_sets),
		);
		if (extraDiffErr) {
			errors.push(extraDiffErr);
		}

		const scenSetDiffErr = formatDiffError(
			code,
			"scenario_encounter_sets",
			diffCodes(expectedScenarioCodes, story.scenario_encounter_sets),
		);
		if (scenSetDiffErr) {
			errors.push(scenSetDiffErr);
		}

		// 2. Story scenarios list (no missing or extra scenarios)
		const dbScenarioCodes = story.scenarios.flatMap((scenario) =>
			ownSetCodes(scenario, encounterSets),
		);
		const scenListDiffErr = formatDiffError(
			code,
			"scenarios",
			diffCodes(expectedScenarioCodes, dbScenarioCodes),
		);
		if (scenListDiffErr) {
			errors.push(scenListDiffErr);
		}

		// 3. Per-scenario encounter_sets and extra_encounter_sets
		for (const valScenario of validation.scenarios) {
			const dbScenario = story.scenarios.find((scenario) =>
				ownSetCodes(scenario, encounterSets).includes(valScenario.code),
			);

			if (!dbScenario) {
				errors.push(
					`[${code}] scenario "${valScenario.code}" not found in story.scenarios`,
				);
				continue;
			}

			const ownCodes = new Set(ownSetCodes(dbScenario, encounterSets));
			const actualScenarioEncounters = (dbScenario.encounter_sets ?? []).filter(
				(setCode) => !ownCodes.has(setCode),
			);
			const actualScenarioExtraEncounters = (
				dbScenario.extra_encounter_sets ?? []
			).filter((setCode) => !ownCodes.has(setCode));

			const scEncErr = formatDiffError(
				`${code}/${valScenario.code}`,
				"scenario.encounter_sets",
				diffCodes(valScenario.encounter_sets, actualScenarioEncounters),
			);
			if (scEncErr) {
				errors.push(scEncErr);
			}

			const scExtraErr = formatDiffError(
				`${code}/${valScenario.code}`,
				"scenario.extra_encounter_sets",
				diffCodes(
					valScenario.extra_encounter_sets,
					actualScenarioExtraEncounters,
				),
			);
			if (scExtraErr) {
				errors.push(scExtraErr);
			}
		}

		// 4. Encounter set and scenario sizes
		for (const item of [
			...validation.encounter_sets,
			...validation.scenarios,
		]) {
			const dbSet = encounterByCode.get(item.code);
			if (!dbSet) {
				errors.push(
					`[${code}] encounter set "${item.code}" not found in encounterSets`,
				);
				continue;
			}
			if (dbSet.size !== item.size) {
				errors.push(
					`[${code}] size mismatch for "${item.code}": expected ${item.size}, got ${dbSet.size}`,
				);
			}
		}

		for (const item of validation.extra_encounter_sets) {
			const dbSet = encounterByCode.get(item.code);
			if (!dbSet) {
				errors.push(
					`[${code}] extra encounter set "${item.code}" not found in encounterSets`,
				);
				continue;
			}
			const expectedFullSize = item.full_size ?? item.size;
			if (dbSet.size !== expectedFullSize) {
				errors.push(
					`[${code}] extra encounter set size mismatch for "${item.code}": expected ${expectedFullSize}, got ${dbSet.size}`,
				);
			}
		}

		// 4b. Story-level encounter_set_data for partial extra sets
		const expectedStoryPartialSets = validation.extra_encounter_sets.filter(
			(item): item is typeof item & { full_size: number } =>
				item.full_size != null && item.full_size !== item.size,
		);
		const actualStorySizesByCode = new Map(
			(story.encounter_set_data ?? []).map((item) => [item.code, item]),
		);

		for (const expected of expectedStoryPartialSets) {
			const actual = actualStorySizesByCode.get(expected.code);
			if (!actual) {
				errors.push(
					`[${code}] missing encounter_set_data entry for "${expected.code}" (expected size=${expected.size}, full_size=${expected.full_size})`,
				);
				continue;
			}
			if (
				actual.size !== expected.size ||
				actual.full_size !== expected.full_size
			) {
				errors.push(
					`[${code}] encounter_set_data mismatch for "${expected.code}": expected ${expected.size}/${expected.full_size}, got ${actual.size}/${actual.full_size}`,
				);
			}
			if (!actual.types || actual.types.length === 0) {
				errors.push(
					`[${code}] encounter_set_data for "${expected.code}" is missing types`,
				);
			} else {
				const typesSum = actual.types.reduce((sum, t) => sum + t.size, 0);
				if (typesSum !== actual.size) {
					errors.push(
						`[${code}] encounter_set_data types sum (${typesSum}) !== size (${actual.size}) for "${expected.code}"`,
					);
				}
			}
		}

		// 5. Product total size
		const productSize = getCampaignProductSize(
			story,
			packEncounterSets,
			encounterSets,
		);
		if (productSize.total !== validation.size) {
			errors.push(
				`[${code}] product size mismatch: expected ${validation.size}, got ${productSize.total}`,
			);
		}
	}

	if (errors.length > 0) {
		for (const error of errors) {
			showError(error);
		}
		throw new Error(
			`Validation quality gate failed with ${errors.length} error(s).`,
		);
	}

	showSuccess(
		`validation quality gate passed (${validationList.length} products verified)`,
	);
};
