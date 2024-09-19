import { IDatabase } from "@/types/database"
import { isNotNil } from "ramda"

export const getStoryScenarioEncounters = ({
  encounterSets,
  scenarios
}: {
  encounterSets: IDatabase.EncounterSet[]
  scenarios: IDatabase.StoryScenario[]
}) => {

  return scenarios.map(({ icon }) => {
    return encounterSets
      .find(encounter => encounter.icon === icon)?.code
  })
  .filter(isNotNil);
}