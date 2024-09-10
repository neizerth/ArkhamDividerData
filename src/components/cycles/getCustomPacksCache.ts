import { loadJSONPacks } from "@/api/arkhamCards/api"
import { linkCustomPacksEncounterSets } from "./linkCustomPacksEncounterSets";
import { IArkhamCards } from "@/types/arkhamCards";
import { getCustomCampaignType } from "@/api/arkhamCards/util";

export const getCustomPacksCache = async () => {
  const packsJSON = await loadJSONPacks();
  
  return packsJSON.map(toExtendedPack);
}

export const toExtendedPack = (pack: IArkhamCards.JSON.Pack): IArkhamCards.JSON.ExtendedPack => {
  return {
    ...pack,
    is_custom: true,
    campaign_type: getCustomCampaignType(pack.code),
    encounter_sets: []
  }
}