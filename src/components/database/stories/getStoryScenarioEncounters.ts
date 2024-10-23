import { IDatabase } from "@/types/database"
import { isNotNil, propEq, uniq } from "ramda"

export const getStoryScenarioEncounters = ({
  encounterSets,
  scenarios
}: {
  encounterSets: IDatabase.EncounterSet[]
  scenarios: IDatabase.StoryScenario[]
}) => {

  const encounters = scenarios.map(({ icon, id, type }) => {
    if (type === 'interlude') {
      return;
    }
    if (!icon) {
      return encounterSets.find(propEq(id, 'code'))?.code;
    }
    return encounterSets
      .find(encounter => encounter.icon === icon)?.code
  })
  .filter(isNotNil);

  return uniq(encounters);
}