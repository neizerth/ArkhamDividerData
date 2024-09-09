import { propEq } from "ramda";
import { IArkhamCards } from "@/types/arkhamCards";

export const getScenarioEncounterSets = ({ steps }: IArkhamCards.JSON.Scenario) => {
  const step = steps.find(propEq('encounter_sets', 'type'));

  return step?.encounter_sets || [];
}