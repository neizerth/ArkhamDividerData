import { IIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IDatabase } from "@/types/database";
import { withEncounters } from "@/util/criteria";
import { groupBy, isNotNil, omit, prop, uniq, values } from "ramda";
import { romanize } from "romans";
import { deromanize } from "romans";

const PART_NUMBER_EXPRESSION = /_part_(\d+)$/;

type IGroupComposer = {
  scenarios: IDatabase.StoryScenario[],
  iconDB: IIconDB
}

export const groupStoryScenarios = ({
  scenarios,
  iconDB
}: IGroupComposer): IDatabase.StoryScenario[] => {
  const extendedScenarios = scenarios.map(scenario => ({
    ...scenario,
    ...getScenarioNumber(scenario),
    ...getScenarioPartNumber(scenario)
  }))
  const headerGroups = 
    groupStoryScenariosByHeader({
      scenarios: extendedScenarios,
      iconDB
    })
    .filter(withEncounters);

  return groupStoryScenariosByNumber({
    scenarios: headerGroups,
    iconDB
  });
}

export const removePartText = (text: string) => text.replace(/, Part .*$/, '');

export const getGroupEncounters = (scenarios: IDatabase.StoryScenario[]) => {
  const encounterSets = uniq(
    scenarios
      .map(prop('encounter_sets'))
      .flat()
      .filter(isNotNil)
  )

  const extraEncounterSets = uniq(
    scenarios
      .map(prop('extra_encounter_sets'))
      .flat()
      .filter(isNotNil)
  )

  return {
    encounter_sets: encounterSets,
    extra_encounter_sets: extraEncounterSets
  }
}

export const groupStoryScenariosByNumber = ({ scenarios, iconDB }: IGroupComposer): IDatabase.StoryScenario[] => {
  const groups = groupBy(
    ({ number = 0 }) => number.toString(),
    scenarios
  );

  return values(groups)
    .filter(isNotNil)
    .map(scenarios => {
      const [first] = scenarios;
      if (scenarios.length === 1) {
        return first;
      }

      const {
        full_name,
        scenario_name,
        header,
      } = first;

      const group = omit(
        [
          'encounter_sets', 
          'extra_encounter_sets',
          'part_text',
          'part_number'
        ],
        first
      )

      const id = first.id.replace(PART_NUMBER_EXPRESSION, '');
      const icon = iconDB.getIcon(id) || first.icon;

      return {
        ...group,
        ...getGroupEncounters(scenarios),
        id,
        icon,
        full_name: removePartText(full_name),
        scenario_name: removePartText(scenario_name),
        header: removePartText(header),
        scenarios
      }
    })
}

export const groupStoryScenariosByHeader = ({ scenarios }: IGroupComposer): IDatabase.StoryScenario[] => {
  const groups = groupBy(
    prop('header'),
    scenarios
  );

  return values(groups)
    .filter(isNotNil)
    .map((group) => {
      const [first, ...scenarios] = group;
      if (group.length === 1) {
        return first;
      }
      
      const scenarioGroup = omit(
        ['encounter_sets', 'extra_encounter_sets'], 
        first
      );

      return {
        ...scenarioGroup,
        ...getGroupEncounters(scenarios),
        scenarios,
      }
    });
}

const isRoman = (text: string) => {
  const re = /^(?=[MDCLXVI])M*(C[MD]|D?C{0,3})(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$/
  return re.test(text);
}

export const getScenarioPartNumber = ({ id }: IDatabase.StoryScenario): Partial<IDatabase.StoryScenario>  => {

  const matches = id.match(PART_NUMBER_EXPRESSION);
  if (!matches) {
    return {};
  }

  const partText = matches[1];
  
  if (!partText) {
    return {}
  }
  
  const partNumber = Number(partText);
  return {
    part_text: romanize(partNumber),
    part_number: partNumber
  }
}

export const getScenarioNumber = (scenario: IDatabase.StoryScenario): Partial<IDatabase.StoryScenario> => {
  const { header } = scenario;
  const numberText = header.replace('Scenario ', '').trim();
  const scenarioNumber = numberText.replace(/[^MDCLXVI]+/, '')

  if (!isRoman(scenarioNumber)) {
    return {
      number_text: numberText,
    };
  }

  return {
    number: deromanize(scenarioNumber),
    number_text: numberText,
  };
}