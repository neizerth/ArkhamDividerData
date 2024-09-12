import { IArkhamCards } from "@/types/arkhamCards"
import { IArkhamDB } from "@/types/arkhamDB"
import { IDatabase } from "@/types/database.old"
import { difference, prop, propEq } from "ramda"
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign"

import campaignMapping from "@/data/arkhamCards/packs.json";
import { IIconDB } from "@/components/arkhamCards/icons/IconDB"


const getCampaignIds = (code: string): string[] => campaignMapping
  .filter(propEq(code, 'arkhamdb_pack_code'))
  .map(prop('arkham_cards_id'));

type IPackToCampaignOptions = {
  campaigns: IArkhamCards.Parsed.Campaign[]
  encounters: IArkhamDB.JSON.ExtendedEncounter[]
  iconDB: IIconDB
}

export const packToCampaign = ({ campaigns, encounters, iconDB }: IPackToCampaignOptions) => 
  (pack: IArkhamDB.JSON.ExtendedPack): IDatabase.Campaign | boolean => {
    const {
      code,
      name,
      cycle_code,
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

    const packEncounters = encounters
      .filter(({ pack_code }) => pack_code === pack.code)
      .map(prop('code'));
    
    return {
      id: code,
      is_size_supported: isSizeSupported,
      icon,
      name,
      is_custom: false,
      is_canonical: true,
      packs: [code],
      cycle_code,
      campaign_type: linkedCampaign.campaign_type,
      encounter_sets: packEncounters,
      extra_encounter_sets: difference(linkedEncounterSets, packEncounters),
      arkham_cards_campaigns: arkhamCardsCampaigns,
      arkham_cards_scenarios: scenarios,
    }
  }