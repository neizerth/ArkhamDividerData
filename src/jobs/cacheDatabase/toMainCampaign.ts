

import { difference, prop, propEq } from "ramda";

import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { IDatabase } from "@/types/database.old";

import campaignMapping from "@/data/arkhamDBCycleMapping.json";
import { IIconDB } from "@/components/arkhamCards/icons/IconDB";

import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign";


export type IMainCampaignOptions = {
  campaigns: IArkhamCards.Parsed.Campaign[]
  encounters: IArkhamDB.JSON.ExtendedEncounter[]
  iconDB: IIconDB
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

export const toMainCampaign = ({ campaigns, encounters, iconDB }: IMainCampaignOptions) => 
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
      is_size_supported,
      encounter_codes,
    } = cycle;

    const icon = iconDB.getId(code);

    const cycleData = {
      id: code,
      cycle_code: code,
      is_size_supported,
      is_canonical: true,
      name,
      position,
      is_custom: false,
      packs: pack_codes,
      icon,
      campaign_type: IDatabase.CampaignType.SIDE,
      return_set_code
    }

    const cycleEncounters = encounters.filter(
      ({ cycle_code }) => code === cycle_code
    )
    .map(prop('code'));

    if (linkedCampaigns.length === 0) {
      console.log(`Campaign ${cycle.code} not found`);

      return {
        ...cycleData,
        arkham_cards_campaigns: [],
        arkham_cards_scenarios: [],
        encounter_sets: cycleEncounters,
        extra_encounter_sets: difference(encounter_codes, cycleEncounters)
      };
    };

    const arkhamCardsCampaigns = linkedCampaigns.map(toLinkedCampaign);
    const linkedEncounterSets = getLinkedEncounterSets(linkedCampaigns);
    const scenarios = getLinkedScenarios(linkedCampaigns);

    return {
      ...cycleData,
      arkham_cards_campaigns: arkhamCardsCampaigns,
      encounter_sets: cycleEncounters,
      arkham_cards_scenarios: scenarios,
      extra_encounter_sets: difference(linkedEncounterSets, cycleEncounters)
    }
  }