import type { ICache } from "./cache"
import type { Mapping } from "./common"
import type { IDatabase } from "./database"

export namespace IBuild {
  export type Core = {
    version: string
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
    custom: Mapping<Mapping>
  }
}