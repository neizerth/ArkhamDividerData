import { IArkhamCards } from "../../types/arkhamCards";
import { propEq } from "ramda";

export const getScenarioEncounterSets = ({ steps }: IArkhamCards.JSON.Scenario) => {
  const step = steps.find(propEq('encounter_sets', 'type'));

  return step?.encounter_sets || [];
}