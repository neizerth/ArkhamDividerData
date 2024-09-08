
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { IDatabase } from "@/types/database";
import { prop, propEq } from "ramda";
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign";
import { replaceIcon } from "./replaceIcon";

import campaignMapping from "@/data/arkhamDBCycleMapping.json";


export type IMainCampaignOptions = {
  campaigns: IArkhamCards.Parsed.Campaign[],
  encounterSets: IDatabase.EncounterSet[]
}

export type IGetLinkedCampaigns = {
  campaigns: IArkhamCards.Parsed.Campaign[],
  cycle: IArkhamDB.JSON.ExtendedCycle
}

export const getCampaignIds = (code: string): string[] =>
  campaignMapping.filter(
    propEq(code, 'arkhamdb_cycle_code')
  )
  .map(prop('arkham_cards_campaign_id'));

export const toMainCampaign = ({ campaigns, encounterSets }: IMainCampaignOptions) => 
  (cycle: IArkhamDB.JSON.ExtendedCycle): IDatabase.Campaign => {
    let linkedCampaigns = campaigns.filter(propEq(cycle.code, 'id'));
    
    if (linkedCampaigns.length === 0) {
      const ids = getCampaignIds(cycle.code);
      linkedCampaigns = campaigns.filter(
        ({ id }) => ids.includes(id)
      );
    }

    const { 
      code,
      name,
      position,
      pack_codes,
      return_set_code,
    } = cycle;

    const cycleData = {
      id: code,
      name,
      position,
      is_custom: false,
      packs: pack_codes,
      campaign_type: IDatabase.CampaignType.SIDE,
      return_set_code
    }

    if (linkedCampaigns.length === 0) {
      console.log(`Campaign ${cycle.code} not found`);

      const campaignEncounterSets = cycle.encounter_codes.map(
        replaceIcon(encounterSets)
      );

      return {
        ...cycleData,
        arkham_cards_campaigns: [],
        arkham_cards_scenarios: [],
        encounter_sets: campaignEncounterSets,
      };
    };

    const arkhamCardsCampaigns = linkedCampaigns.map(toLinkedCampaign);
    const linkedEncounterSets = getLinkedEncounterSets(linkedCampaigns);
    const scenarios = getLinkedScenarios(linkedCampaigns);

    return {
      ...cycleData,
      arkham_cards_campaigns: arkhamCardsCampaigns,
      encounter_sets: linkedEncounterSets,
      arkham_cards_scenarios: scenarios
    }
  }
