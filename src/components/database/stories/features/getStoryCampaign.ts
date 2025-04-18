import type { IIconDB } from "@/components/arkhamCards/icons/IconDB";
import type { IArkhamCards } from "@/types/arkhamCards";
import type { ICache } from "@/types/cache";
import type { IDatabase } from "@/types/database";
import { prop, propEq, uniqBy } from "ramda";

export const createStoryCampaignHandler = ({
  iconDB,
  scenarioEncounters
}: {
  iconDB: IIconDB
  scenarioEncounters: ICache.ScenarioEncounterSet[]
}) => {

  return ({
    fullCampaign,
    cycle_code
  }: {
    fullCampaign: IArkhamCards.JSON.FullCampaign
    cycle_code?: string
  }): IDatabase.StoryCampaign => {
    const {
      campaign,
      scenarios,
    } = fullCampaign;
    
    const {
      id,
      name,

    } = campaign;

    const iconList = [];

    if (id === 'core') {
      iconList.push(campaign.id);
    }

    iconList.push(cycle_code);

    const data = {
      id,
      name,
      icon: iconDB.getIconOf(iconList),
      scenarios: scenarios.map(prop('id'))
    }
    
    const encounters = uniqBy(
      prop('encounter_set_code'),
      scenarioEncounters
        .filter(propEq(id, 'campaign_id'))
    )

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