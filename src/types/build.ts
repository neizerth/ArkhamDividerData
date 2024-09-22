import { ICache } from "./cache"
import { Mapping } from "./common"
import { IDatabase } from "./database"

export namespace IBuild {
  export type Core = {
    languages: string[]
    stories: IDatabase.Story[]
    encounterSets: IDatabase.EncounterSet[]
    packs: ICache.Pack[]
    cycles: ICache.Cycle[]
    icons: ICache.IconInfo[]
  }
  export type Translation = {
    translatedCampaigns: string[]
    translatedScenarios: string[]
    translatedStories: string[]
    campaigns: Mapping
    scenarios: Mapping
    stories: Mapping
    encounterSets: Mapping
    investigators: Mapping
    common: Mapping
  }
}