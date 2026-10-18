import type { IIconDB } from "@/components/arkhamCards/icons/IconDB";
import type { IDatabase } from "@/types/database";
import { withEncounters } from "@/util/criteria";
import { groupBy, isNotNil, omit, prop, uniq, values } from "ramda";
import { deromanize, romanize } from "romans";
import { mergeScenarioEncounterSetSizes } from "./getEncounterSetSizes";

const PART_NUMBER_EXPRESSION = /_part_(\d+)$/;

type IGroupComposer = {
	scenarios: IDatabase.StoryScenario[];
	iconDB: IIconDB;
	encounterSets?: IDatabase.EncounterSet[];
};

export const groupStoryScenarios = ({
	scenarios,
	iconDB,
	encounterSets = [],
}: IGroupComposer): IDatabase.StoryScenario[] => {
	const extendedScenarios = scenarios.map((scenario) => ({
		...scenario,
		...getScenarioNumber(scenario),
		...getScenarioPartNumber(scenario),
	}));
	const headerGroups = groupStoryScenariosByHeader({
		scenarios: extendedScenarios,
		iconDB,
		encounterSets,
	});

	return groupStoryScenariosByNumber({
		scenarios: headerGroups,
		iconDB,
		encounterSets,
	}).filter(withEncounters);
};

export const removePartText = (text: string) => text.replace(/, Part .*$/, "");

export const getGroupEncounters = (
	scenarios: IDatabase.StoryScenario[],
	allEncounterSets: IDatabase.EncounterSet[] = [],
) => {
	const encounterSets = uniq(
		scenarios.flatMap(prop("encounter_sets")).filter(isNotNil),
	);

	const extraEncounterSets = uniq(
		scenarios.flatMap(prop("extra_encounter_sets")).filter(isNotNil),
	);

	const encounterSetSizes = mergeScenarioEncounterSetSizes({
		groups: scenarios.map((scenario) => ({
			encounter_sets: [
				...(scenario.encounter_sets ?? []),
				...(scenario.extra_encounter_sets ?? []),
			],
			encounter_set_data: scenario.encounter_set_data,
		})),
		encounterSets: allEncounterSets,
	});

	return {
		encounter_sets: encounterSets,
		extra_encounter_sets: extraEncounterSets,
		...(encounterSetSizes.length > 0
			? { encounter_set_data: encounterSetSizes }
			: {}),
	};
};

export const groupStoryScenariosByNumber = ({
	scenarios,
	iconDB,
	encounterSets = [],
}: IGroupComposer): IDatabase.StoryScenario[] => {
	const coreScenario = scenarios.find(
		({ id, type }) => id === "core" || type === "core",
	);

	const groups = groupBy(({ id, number, header, campaign_id }) => {
		const groupKey =
			number ||
			(header?.startsWith("Part ")
				? id.replace(PART_NUMBER_EXPRESSION, "")
				: id);
		return `${campaign_id}_${groupKey}`;
	}, scenarios);

	return values(groups)
		.filter(isNotNil)
		.flatMap((scenarios) => {
			const [first] = scenarios;
			if (scenarios.length === 1) {
				const nested = first.scenarios;
				if (
					nested &&
					nested.length > 0 &&
					PART_NUMBER_EXPRESSION.test(first.id)
				) {
					const group = omit(
						[
							"encounter_sets",
							"extra_encounter_sets",
							"encounter_set_data",
							"part_text",
							"part_number",
							"scenarios",
						],
						first,
					);

					const {
						full_name,
						scenario_name,
						header,
						number,
						number_text = "",
					} = first;

					const changeGroupText = (text: string) => {
						const romanText = number ? romanize(number) : "";
						return removePartText(text)
							.replace(number_text, romanText)
							.replace(/(Scenario )(.*):/, "$1" + romanText + ":");
					};
					const id = first.id.replace(PART_NUMBER_EXPRESSION, "");
					const icon = iconDB.getIcon({ id }) || first.icon;

					return {
						...group,
						...getGroupEncounters(nested, encounterSets),
						id,
						icon,
						full_name: changeGroupText(full_name),
						scenario_name: changeGroupText(scenario_name),
						header: changeGroupText(header),
						scenarios: nested,
					};
				}
				return first;
			}

			const haveParts = scenarios.every((scenario) => scenario.part_number);

			if (!haveParts) {
				return scenarios;
			}

			const {
				full_name,
				scenario_name,
				header,
				number,
				number_text = "",
			} = first;

			const group = omit(
				[
					"encounter_sets",
					"extra_encounter_sets",
					"encounter_set_data",
					"part_text",
					"part_number",
				],
				first,
			);

			const id = first.id.replace(PART_NUMBER_EXPRESSION, "");
			const icon = iconDB.getIcon({ id }) || first.icon;

			if (header?.startsWith("Part ") && coreScenario) {
				return {
					...group,
					...getGroupEncounters(scenarios, encounterSets),
					id,
					icon,
					full_name: coreScenario.full_name || coreScenario.scenario_name,
					scenario_name: coreScenario.scenario_name,
					header: "",
				};
			}

			const changeGroupText = (text: string) => {
				const romanText = number ? romanize(number) : "";
				return removePartText(text)
					.replace(number_text, romanText)
					.replace(/(Scenario )(.*):/, "$1" + romanText + ":");
			};

			return {
				...group,
				...getGroupEncounters(scenarios, encounterSets),
				id,
				icon,
				full_name: changeGroupText(full_name),
				scenario_name: changeGroupText(scenario_name),
				header: changeGroupText(header),
				scenarios,
			};
		});
};

export const groupStoryScenariosByHeader = ({
	scenarios,
	encounterSets = [],
}: IGroupComposer): IDatabase.StoryScenario[] => {
	const groups = groupBy(
		({ header, id }) => (header.includes("Scenario ") ? header : id),
		scenarios,
	);

	return values(groups)
		.filter(isNotNil)
		.flatMap((group) => {
			const [first] = group;
			if (!first.header) {
				return group;
			}
			if (group.length === 1) {
				return first;
			}

			const scenariosWithEncounters = group.filter(withEncounters);
			if (scenariosWithEncounters.length <= 1) {
				return scenariosWithEncounters;
			}

			const primary =
				group.find(
					(scenario) =>
						!/(_part)?_\d+$/.test(scenario.id) && scenario.type !== "interlude",
				) ?? scenariosWithEncounters[0];

			const scenarioGroup = omit(
				["encounter_sets", "extra_encounter_sets", "encounter_set_data"],
				primary,
			);

			return {
				...scenarioGroup,
				...getGroupEncounters(scenariosWithEncounters, encounterSets),
				scenarios: scenariosWithEncounters,
			};
		});
};

const isRoman = (text: string) => {
	const re =
		/^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/;
	return re.test(text);
};

export const getScenarioPartNumber = ({
	id,
}: IDatabase.StoryScenario): Partial<IDatabase.StoryScenario> => {
	const matches = id.match(PART_NUMBER_EXPRESSION);
	if (!matches) {
		return {};
	}

	const partText = matches[1];

	if (!partText) {
		return {};
	}

	const partNumber = Number(partText);
	return {
		part_text: romanize(partNumber),
		part_number: partNumber,
	};
};

export const getScenarioNumber = (
	scenario: IDatabase.StoryScenario,
): Partial<IDatabase.StoryScenario> => {
	const { header } = scenario;
	if (!header.includes("Scenario")) {
		return {};
	}
	const numberText = header.replace("Scenario", "").trim();

	if (!numberText) {
		return {};
	}

	const scenarioNumber = numberText.replace(/[^MDCLXVI]+/, "");

	if (!isRoman(scenarioNumber)) {
		return {
			number_text: numberText,
		};
	}

	return {
		number: deromanize(scenarioNumber),
		number_text: numberText,
	};
};
