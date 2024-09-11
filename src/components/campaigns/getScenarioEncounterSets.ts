import { identity, prop } from "ramda";
import { IArkhamCards } from "@/types/arkhamCards";

export const getScenarioEncounterSets = ({ steps }: IArkhamCards.JSON.Scenario) => {
  return steps.map(prop('encounter_sets'))
    .filter(identity)
    .flat() as string[];
}