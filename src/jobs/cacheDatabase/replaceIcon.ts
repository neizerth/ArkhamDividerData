import { withCode } from "../../api/arkhamDB/criteria";
import { IDatabase } from "../../types/database";

export const replaceIcon = (encounterSets: IDatabase.EncounterSet[]) => 
  (code: string): string => {
    const encounterSet = encounterSets.find(withCode(code));
    if (!encounterSet) {
      console.log(`encounter code "${code}" not found`);
    }
    return encounterSet?.arkhamdb_code || code;
  }