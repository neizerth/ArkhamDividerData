import { IArkhamDB } from "@/types/arkhamDB";
import { CUSTOM_CAMPAIGN_CODE, CUSTOM_SCENARIO_CODE, NON_CANONICAL_CODE } from "./constants";

export const customTypeMap = new Map([
  [CUSTOM_CAMPAIGN_CODE, IArkhamDB.CampaignType.CAMPAIGN],
  [CUSTOM_SCENARIO_CODE, IArkhamDB.CampaignType.SIDE_STORIES],
  [NON_CANONICAL_CODE, IArkhamDB.CampaignType.CAMPAIGN]
])

export const getCustomCampaignType = (code: string): IArkhamDB.CampaignType => {
  const type = customTypeMap.get(code);
  if (type) {
    return type;
  }
  return IArkhamDB.CampaignType.CAMPAIGN;
}