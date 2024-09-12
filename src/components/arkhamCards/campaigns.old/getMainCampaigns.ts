import { prop } from "ramda";

import { SIDE_STORIES_CODE } from "@/api/arkhamCards/constants";
import { IArkhamCards } from "@/types/arkhamCards";
import { unique } from "@/util/common";
import { createIconDB, IIconDB } from "@/components/arkhamCards/icons/IconDB";
import { getScenarioEncounterSets } from "./getScenarioEncounterSets";

export const getMainCampaigns = (campaigns: IArkhamCards.JSON.FullCampaign[]) => {
  const iconDB = createIconDB();

  return campaigns
    .filter(({ campaign }) => campaign.id !== SIDE_STORIES_CODE)
    .map(parseMainCampaign({ iconDB }));
}


export const parseMainCampaign = ({ 
  iconDB
}: { 
  iconDB: IIconDB
}) => ({ campaign, scenarios }: IArkhamCards.JSON.FullCampaign): IArkhamCards.Parsed.ExtendedCampaign => {
  const { 
    id,
    position,
    version,
    name,
    campaign_type,
    custom
  } = campaign;
  const campaignScenarios = scenarios.map((scenario): IArkhamCards.Parsed.Scenario => {
    const { 
      id,
      full_name, 
      scenario_name,  
      icon,
      header
    } = scenario;

    return {
      header,
      id,
      campaign_id: campaign.id,
      icon: iconDB.getId(icon),
      full_name,
      scenario_name,
      encounter_sets: getScenarioEncounterSets(scenario)
    }
  });

  const encounterSets = campaignScenarios.map(prop('encounter_sets')).flat();
  const uniqueEncounterSets = unique(encounterSets);
  const isCustom = Boolean(custom);

  return {
    id,
    position,
    version,
    name,
    campaign_type,
    is_scenario: false,
    custom,
    is_custom: isCustom,
    // is_canonical: 
    encounter_sets: uniqueEncounterSets,
    scenarios: campaignScenarios
  }
}