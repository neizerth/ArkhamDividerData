import { IArkhamCards } from "./arkhamCards"
import { IArkhamDB } from "./arkhamDB"

export namespace IDatabase {
  export type ArkhamCardsCampaign = {
    code: string
    position?: number
    version?: number
  }

  export type EncounterSet = IArkhamDB.JSON.ExtendedEncounter & {
    arkhamdb_code?: string
    icon?: string
    size?: number
    is_custom: boolean
  }

  export type Pack = IArkhamCards.JSON.ExtendedPack;
  
  export enum CampaignType {
    PARALLEL = 'parallel',
    STANDALONE = 'standalone',
    SIDE = 'side_story',
    CHALLENGE = 'challenge',
    CAMPAIGN = 'campaign'
  }

  // export type CampaignType = IArkhamCards.CampaignType | IArkhamCards.ScenarioType | Util.CampaignType

  export type Campaign = {
    id: string
    name: string
    cycle_code?: string
    is_custom: boolean
    campaign_type: string
    arkham_cards_campaigns: ArkhamCardsCampaign[]
    arkham_cards_scenarios: string[]
    encounter_sets: string[]
    extra_encounter_sets: string[]
    icon?: string

    position?: number
    packs?: string[]
    return_set_code?: string
    arkhamdb_pack_code?: string;
    custom_content?: IArkhamCards.CustomContent
    is_size_supported: boolean;
    is_canonical: boolean
  }
}