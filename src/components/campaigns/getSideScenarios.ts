import { IArkhamCards } from "../../types/arkhamCards";
import { getScenarioEncounterSets } from "./getScenarioEncounterSets";
import { SIDE_ID } from "../../api/arkhamCards/constants";

export const getSideScenarios = (campaigns: IArkhamCards.JSON.FullCampaign[]): IArkhamCards.Parsed.ExtendedCampaign[] => {
  const sideCampaign = campaigns.find(
    ({ campaign }) => campaign.id === SIDE_ID
  );

  if (!sideCampaign) {
    return [];
  }

  return sideCampaign.scenarios.map(scenario => {
    const { 
      id,
      scenario_name, 
      full_name, 
      side_scenario_type,
      header,
      custom, 
      icon
    } = scenario;

    const encounterSets = getScenarioEncounterSets(scenario);

    const sideScenario = {
      id,
      campaign_id: id,
      encounter_sets: encounterSets,
      scenario_name,
      header,
      full_name,
      icon
    }

    return {
      id: id,
      is_scenario: true,
      name: scenario_name,
      full_name,
      header,
      custom,
      is_custom: Boolean(custom),
      campaign_type: side_scenario_type,
      encounter_sets: encounterSets,
      scenarios: [sideScenario]
    }
  });
}



