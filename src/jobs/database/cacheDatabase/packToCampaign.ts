import { IArkhamCards } from "@/types/arkhamCards"
import { IArkhamDB } from "@/types/arkhamDB"
import { IDatabase } from "@/types/database"
import { propEq } from "ramda"
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign"

export type IPackToCampaign = {
  campaigns: IArkhamCards.Parsed.Campaign[]
  encounterSets: IDatabase.EncounterSet[]
  official: boolean
  campaignType: IDatabase.CampaignType
}

export const packToCampaign = ({ 
  campaigns, 
  official,
  campaignType
}: IPackToCampaign) => 
  (pack: IArkhamDB.JSON.ExtendedPack): IDatabase.Campaign | boolean => {
    const {
      code,
      name,
    } = pack;

    const linkedCampaigns = campaigns.filter(propEq(name, 'name'));

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