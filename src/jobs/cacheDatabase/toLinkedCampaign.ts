import { IArkhamCards } from "@/types/arkhamCards";
import { unique } from "@/util/common";
import { prop } from "ramda";

export const toLinkedCampaign = (campaign: IArkhamCards.Parsed.Campaign) => {
  return {
    code: campaign.id,
    position: campaign.position,
    version: campaign.version
  }
}

export const getLinkedEncounterSets = (campaigns: IArkhamCards.Parsed.Campaign[]) => {
  const encounterSets = campaigns.map(prop('encounter_sets')).flat();

  return unique(encounterSets);
}

export const getLinkedScenarios = (campaigns: IArkhamCards.Parsed.Campaign[]) => {
  return campaigns.map(prop('scenarios')).flat();
}