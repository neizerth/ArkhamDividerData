import { CORE_CYCLE_CODE, CORE_RETURN_CODE, RETURN_CYCLE_PREFIX } from "@/api/arkhamDB/constants";
import { withCode } from "@/api/arkhamDB/criteria";
import { IArkhamDB } from "@/types/arkhamDB";

export const withReturnSetCode = (returnPacks: IArkhamDB.HasCode[]) => 
  <T extends IArkhamDB.HasCode>(cycle: T): T & IArkhamDB.HasReturnSet<string> => {
    
    const code = cycle.code === CORE_CYCLE_CODE ? CORE_RETURN_CODE : RETURN_CYCLE_PREFIX + cycle.code;

    const returnSetCode = returnPacks.find(withCode(code))?.code;

    return {
      ...cycle,
      return_set_code: returnSetCode
    };
  }