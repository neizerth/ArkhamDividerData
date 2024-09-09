import { SIDE_ID } from "../../api/arkhamCards/constants";
import { IArkhamCards } from "../../types/arkhamCards";
import { unique } from "../../util/common";
import { getScenarioEncounterSets } from "./getScenarioEncounterSets";
import { prop } from "ramda";

export const getMainCampaigns = (campaigns: IArkhamCards.JSON.FullCampaign[]) => {
  return campaigns
    .filter(({ campaign }) => campaign.id !== SIDE_ID)
    .map(parseMainCampaign);
}


export const parseMainCampaign = ({ campaign, scenarios }: IArkhamCards.JSON.FullCampaign): IArkhamCards.Parsed.ExtendedCampaign => {
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
      icon,
      full_name,
      scenario_name,
      encounter_sets: getScenarioEncounterSets(scenario)
    }
  });

  const encounterSets = campaignScenarios.map(prop('encounter_sets')).flat();
  const uniqueEncounterSets = unique(encounterSets);

  return {
    id,
    position,
    version,
    name,
    campaign_type,
    is_scenario: false,
    custom,
    is_custom: Boolean(custom),
    encounter_sets: uniqueEncounterSets,
    scenarios: campaignScenarios
  }
}