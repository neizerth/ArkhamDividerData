import { IArkhamCards } from "./arkhamCards"
import { IArkhamDB } from "./arkhamDB"
import { ICache } from "./cache"
import { Mapping } from "./common"
import { IDatabase } from "./database"
import { IIcoMoon } from "./icomoon"

export namespace IBuild {
  export type Core = {
    languages: string[]
    stories: IDatabase.Story[]
    encounterSets: IDatabase.EncounterSet[]
    scenarios: IArkhamCards.Parsed.Scenario[]
    packs: ICache.Pack[]
    cycles: ICache.Cycle[]
    icons: IIcoMoon.Icon[]
  }
  export type Translation = {
    translatedCampaigns: string[]
    campaigns: Mapping;
    scenarios: Mapping;
    encounterSets: Mapping;
    common: Mapping
  }
}