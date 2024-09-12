import { IArkhamCards } from "@/types/arkhamCards";
import { getScenarioEncounterSets } from "./getScenarioEncounterSets";
import { SIDE_STORIES_CODE } from "@/api/arkhamCards/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";

export const getSideScenarios = (campaigns: IArkhamCards.JSON.FullCampaign[]): IArkhamCards.Parsed.ExtendedCampaign[] => {
  const sideCampaign = campaigns.find(
    ({ campaign }) => campaign.id === SIDE_STORIES_CODE
  );

  if (!sideCampaign) {
    return [];
  }

  const iconDB = createIconDB();

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
      icon: iconDB.getIcon(icon)
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



