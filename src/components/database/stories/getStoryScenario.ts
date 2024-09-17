import { IIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IArkhamCards } from "@/types/arkhamCards";
import { ICache } from "@/types/cache";
import { IDatabase } from "@/types/database";
import { prop, propEq, uniqBy } from "ramda";

export const createStoryScenarioHandler = ({
  iconDB,
  scenarioEncounters
}: {
  iconDB: IIconDB
  scenarioEncounters: ICache.ScenarioEncounterSet[]
}) => {
  return ({
    campaignId,
    scenario,
    includeEncounters = true
  }: {
    campaignId: string
    scenario: IArkhamCards.JSON.Scenario
    includeEncounters?: boolean
  }): IDatabase.StoryScenario => {
    const {
      id,
      scenario_name,
      full_name,
      header,
      icon,
    } = scenario;
    
    const data = {
      id,
      campaign_id: campaignId,
      scenario_name,
      full_name,
      header,
      icon: iconDB.getIconOf([icon, id]),
    }
    
    if (!includeEncounters) {
      return data;
    }

    const encounters = uniqBy(
      prop('encounter_set_code'),
      scenarioEncounters
        .filter(
          ({ scenario_id, campaign_id }) => scenario_id === id && 
            campaign_id === campaignId
      )
    );
    
    const requiredEncounters = encounters
      .filter(
        propEq(false, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const extraEncounters = encounters
      .filter(
        propEq(true, 'is_extra')
      )
      .map(prop('encounter_set_code'));

    return {
      ...data,
      encounter_sets: requiredEncounters,
      extra_encounter_sets: extraEncounters
    }
  }
}