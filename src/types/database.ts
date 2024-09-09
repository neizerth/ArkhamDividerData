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
    icon: string
  }
  
  export enum CampaignType {
    PARALLEL = 'parallel',
    STANDALONE = 'standalone',
    SIDE = 'side_story',
    CHALLENGE = 'challenge',
    CAMPAIGN = 'campaign'
  }

  export type ArkhamDBPack = {

  }

  // export type CampaignType = IArkhamCards.CampaignType | IArkhamCards.ScenarioType | Util.CampaignType

  export type Campaign = {
    id: string
    name: string
    is_custom: boolean
    campaign_type: string
    arkham_cards_campaigns: ArkhamCardsCampaign[]
    arkham_cards_scenarios: string[]
    encounter_sets: string[]
    icon?: string

    position?: number
    packs?: string[]
    return_set_code?: string
    arkhamdb_pack_code?: string;
    custom_content?: IArkhamCards.CustomContent
  }
}