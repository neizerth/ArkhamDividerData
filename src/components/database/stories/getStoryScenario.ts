import { IIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IArkhamCards } from "@/types/arkhamCards";
import { ICache } from "@/types/cache";
import { IDatabase } from "@/types/database";
import { prop, propEq, uniqBy } from "ramda";
import { romanize } from "romans";

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
      steps
    } = scenario;
    
    const iconList = [];

    if (id === 'core') {
      iconList.push(campaignId);
    }
    iconList.push(icon, id);

    const data = {
      id,
      campaign_id: campaignId,
      scenario_name,
      full_name,
      header,
      icon: iconDB.getIconOf(iconList),
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

    const encounterSetGroups = steps
      .filter(propEq('encounter_sets', 'type'))
      .map(({
        id,
        title,
        aside,
        type,
        encounter_sets = []
      }): IDatabase.ScenarioEncounterSetGroup => ({
        id,
        title,
        type,
        aside,
        encounter_sets,
        ...getStepSetup(id)
      }))

    return {
      ...data,
      encounter_sets: requiredEncounters,
      extra_encounter_sets: extraEncounters,
      encounter_set_groups: encounterSetGroups
    }
  }
}

export const getStepSetup = (id: string) => {
  const versionRe = /_v(\d+)?$/;
  const versionMatch = id.match(versionRe);
  const isDefault = id.startsWith('gather_encounter_sets')
  
  const defaultData = {
    is_default: isDefault,
    version_number: 1,
    version_text: 'I'
  }

  if (!versionMatch) {
    return defaultData;
  }

  if (!versionMatch[1]) {
    return defaultData;
  }

  const version = +versionMatch[1];
  const versionText = romanize(version);
  
  return {
    is_default: isDefault,
    version_number: version,
    version_text: versionText
  }
}