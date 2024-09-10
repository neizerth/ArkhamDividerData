import { IArkhamCards } from "@/types/arkhamCards"
import { IArkhamDB } from "@/types/arkhamDB"
import { IDatabase } from "@/types/database"
import { prop, propEq } from "ramda"
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign"

import campaignMapping from "@/data/arkhamDBPackMapping.json";
import { IIconDB } from "@/components/icons/IconDB"


const getCampaignIds = (code: string): string[] => campaignMapping
  .filter(propEq(code, 'arkhamdb_pack_code'))
  .map(prop('arkham_cards_id'));

type IPackToCampaignOptions = {
  campaigns: IArkhamCards.Parsed.Campaign[]
  iconDB: IIconDB
}

export const packToCampaign = ({ campaigns, iconDB }: IPackToCampaignOptions) => 
  (pack: IArkhamDB.JSON.ExtendedPack): IDatabase.Campaign | boolean => {
    const {
      code,
      name,
      size
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
    const icon = iconDB.getId(code);

    const arkhamCardsCampaigns = linkedCampaigns.map(toLinkedCampaign);
    const linkedEncounterSets = getLinkedEncounterSets(linkedCampaigns);
    const scenarios = getLinkedScenarios(linkedCampaigns);
    const [linkedCampaign] = linkedCampaigns;
    const isSizeSupported = Boolean(size);
    
    return {
      id: code,
      is_size_supported: isSizeSupported,
      icon,
      name,
      is_custom: false,
      is_canonical: true,
      arkhamdb_pack_code: code,
      campaign_type: linkedCampaign.campaign_type,
      encounter_sets: linkedEncounterSets,
      arkham_cards_campaigns: arkhamCardsCampaigns,
      arkham_cards_scenarios: scenarios
    }
  }