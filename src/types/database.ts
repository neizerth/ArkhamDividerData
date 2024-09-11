import { IArkhamCards } from "./arkhamCards"

export namespace IDatabase {
  export type ArkhamCardsCampaign = {
    code: string
    position?: number
    version?: number
  }

  export enum EncounterSetSource {
    ARKHAMDB = 'adb',
    ARKHAM_CARDS = 'arkham-cards'
  }

  export type EncounterSet = {
    code?: string;
    name?: string; 
    pack_code?: string
    cycle_code?: string
    source: EncounterSetSource,
    icon?: string
    size?: number
    is_custom?: boolean
  }

  export type Pack = IArkhamCards.JSON.ExtendedPack;
  
  export enum CampaignType {
    PARALLEL = 'parallel',
    STANDALONE = 'standalone',
    SIDE = 'side_story',
    CHALLENGE = 'challenge',
    CAMPAIGN = 'campaign'
  }

  export type Cycle = {

  }
  
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