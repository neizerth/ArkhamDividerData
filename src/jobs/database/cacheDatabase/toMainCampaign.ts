import { withCode } from "@/api/arkhamDB/criteria";
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { IDatabase } from "@/types/database";
import { unique } from "@/util/common";
import { prop, propEq } from "ramda";
import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign";


export type IMainCampaignOptions = {
  campaigns: IArkhamCards.Parsed.Campaign[],
  encounterSets: IDatabase.EncounterSet[]
}

export type IGetCampaignEncounterSetsOptions = Omit<IMainCampaignOptions, 'campaigns'> & {
  cycle: IArkhamDB.JSON.ExtendedCycle
} 

export const getCampaignEncounterSets = ({ cycle, encounterSets }: IGetCampaignEncounterSetsOptions): string[] => {
  const changeCode = (code: string) => {
    const encounterSet = encounterSets.find(withCode(code));
    if (!encounterSet) {
      console.log(`encounter code "${code}" not found`);
    }
    return encounterSet?.arkhamdb_code || code;
  }

  return cycle.encounter_codes.map(changeCode);
}

export type IGetLinkedCampaigns = {
  campaigns: IArkhamCards.Parsed.Campaign[],
  cycle: IArkhamDB.JSON.ExtendedCycle
}

export const toMainCampaign = ({ campaigns, encounterSets }: IMainCampaignOptions) => 
  (cycle: IArkhamDB.JSON.ExtendedCycle): IDatabase.Campaign => {
    const linkedCampaigns = campaigns.filter(propEq(cycle.code, 'id'));

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
      official: true,
      packs: pack_codes,
      campaign_type: IDatabase.CampaignType.CAMPAIGN,
      return_set_code
    }

    if (linkedCampaigns.length === 0) {
      console.log(`Campaign ${cycle.code} not found`);

      const campaignEncounterSets = getCampaignEncounterSets({
        cycle,
        encounterSets
      });

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
