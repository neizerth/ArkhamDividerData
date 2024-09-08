import { IArkhamCards } from "@/types/arkhamCards"
import { IArkhamDB } from "@/types/arkhamDB"
import { IDatabase } from "@/types/database"
import { prop, propEq } from "ramda"
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign"

import campaignMapping from "@/data/arkhamDBPackMapping.json";

export type IPackToCampaign = {
  campaigns: IArkhamCards.Parsed.Campaign[]
  official: boolean
}

const getCampaignIds = (code: string): string[] => campaignMapping
  .filter(propEq(code, 'arkhamdb_pack_code'))
  .map(prop('arkham_cards_id'));

export const packToCampaign = ({ 
  campaigns, 
  official
}: IPackToCampaign) => 
  (pack: IArkhamDB.JSON.ExtendedPack): IDatabase.Campaign | boolean => {
    const {
      code,
      name,
    } = pack;

    let linkedCampaigns = campaigns.filter(propEq(name, 'name'));
    
    if (linkedCampaigns.length === 0) {
      const ids = getCampaignIds(code);
      linkedCampaigns = campaigns.filter(
        ({ id }) => ids.includes(id)
      );
    }

    if (linkedCampaigns.length === 0) {
      console.log(`campaign for pack ${pack.name} not found!`);
      return false;
    }

    const arkhamCardsCampaigns = linkedCampaigns.map(toLinkedCampaign);
    const linkedEncounterSets = getLinkedEncounterSets(linkedCampaigns);
    const scenarios = getLinkedScenarios(linkedCampaigns);
    const [linkedCampaign] = linkedCampaigns;
    
    return {
      id: code,
      name,
      official,
      arkhamdb_pack_code: code,
      campaign_type: linkedCampaign.campaign_type,
      encounter_sets: linkedEncounterSets,
      arkham_cards_campaigns: arkhamCardsCampaigns,
      arkham_cards_scenarios: scenarios
    }
  }