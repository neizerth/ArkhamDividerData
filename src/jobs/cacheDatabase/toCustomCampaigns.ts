import { RETURN_CYCLE_PREFIX } from "@/api/arkhamDB/constants";
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { IDatabase } from "@/types/database";
import { propEq } from "ramda";
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign";

export const getReturnToCode = (id: string, cycles: IArkhamDB.JSON.ExtendedCycle[]) => {
  const returnToCode = id.slice(0, RETURN_CYCLE_PREFIX.length);

  if (returnToCode !== RETURN_CYCLE_PREFIX) {
    return;
  }

  return cycles.find(propEq(returnToCode, 'code'))?.code;
}

export const toCustomCampaign = (cycles: IArkhamDB.JSON.ExtendedCycle[]) =>
  (campaign: IArkhamCards.Parsed.Campaign): IDatabase.Campaign => {
    const {
      id,
      name,
      position,
      campaign_type,
      custom
    } = campaign;

    const returnSetCode = getReturnToCode(id, cycles);
    const linkedCampaigns = [campaign];

    const scenarios = getLinkedScenarios(linkedCampaigns);
    const arkhamCampaigns = linkedCampaigns.map(toLinkedCampaign);
    const encounterSets = getLinkedEncounterSets(linkedCampaigns);

    return {
      id,
      name,
      position,
      is_custom: true,
      campaign_type,
      return_set_code: returnSetCode,
      custom_content: custom,
      encounter_sets: encounterSets,
      arkham_cards_scenarios: scenarios,
      arkham_cards_campaigns: arkhamCampaigns
    }
  }