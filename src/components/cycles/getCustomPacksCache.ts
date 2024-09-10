import { loadJSONPacks } from "@/api/arkhamCards/api"
import { linkCustomPacksEncounterSets } from "./linkCustomPacksEncounterSets";
import { IArkhamCards } from "@/types/arkhamCards";
import { getCustomCampaignType } from "@/api/arkhamCards/util";
import { NON_CANONICAL_CODE } from "@/api/arkhamCards/constants";

export const getCustomPacksCache = async () => {
  const packsJSON = await loadJSONPacks();
  
  return await linkCustomPacksEncounterSets(packsJSON);
  // return packsJSON.map(toExtendedPack);
}

export const toExtendedPack = (pack: IArkhamCards.JSON.Pack): IArkhamCards.JSON.ExtendedPack => {
  return {
    ...pack,
    is_custom: true,
    is_canonical: pack.cycle_code !== NON_CANONICAL_CODE,
    campaign_type: getCustomCampaignType(pack.cycle_code),
    encounter_sets: []
  }
}