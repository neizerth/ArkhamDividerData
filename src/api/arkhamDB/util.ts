import { 
  CORE_CYCLE_CODE, 
  CORE_RETURN_CODE, 
  RETURN_CYCLE_PREFIX,
  SPECIAL_CAMPAIGN_TYPES,
} from "@/api/arkhamDB/constants";
import { withCode } from "@/api/arkhamDB/criteria";
import { IArkhamDB } from "@/types/arkhamDB";

export const withReturnSetCode = (returnPacks: IArkhamDB.HasCode[]) => 
  <T extends IArkhamDB.HasCode>(cycle: T): T & IArkhamDB.HasReturnSetCode<string> => {
    
    const code = cycle.code === CORE_CYCLE_CODE ? CORE_RETURN_CODE : RETURN_CYCLE_PREFIX + cycle.code;

    const returnSetCode = returnPacks.find(withCode(code))?.code;

    return {
      ...cycle,
      return_set_code: returnSetCode
    };
  }

export const getCampaignType = (code: string): IArkhamDB.CampaignType => {
  if (SPECIAL_CAMPAIGN_TYPES.includes(code)) {
    return code as IArkhamDB.CampaignType;
  }
  return IArkhamDB.CampaignType.CAMPAIGN;
}