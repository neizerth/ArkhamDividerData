import { IArkhamCards } from "./arkhamCards"
import { IArkhamDB } from "./arkhamDB"
import { Mapping } from "./common"
import { IDatabase } from "./database"

export namespace IBuild {
  export type Core = {
    languages: string[]
    campaigns: IDatabase.Campaign[]
    encounterSets: IDatabase.EncounterSet[]
    scenarios: IArkhamCards.Parsed.Scenario[]
    packs: IDatabase.Pack[]
    cycles: IArkhamDB.JSON.ExtendedCycle[]
  }
  export type Translation = {
    translatedCampaigns: string[]
    campaigns: Mapping;
    scenarios: Mapping;
    encounterSets: Mapping;
    common: Mapping
  }
}