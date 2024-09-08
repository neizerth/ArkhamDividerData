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
    CAMPAIGN = 'campaign',
  }

  export type ArkhamDBPack = {

  }

  export type Campaign = {
    id: string
    name: string
    position?: number
    packs?: string[]
    official: boolean
    campaign_type: CampaignType
    return_set_code?: string
    arkhamdb_pack_code?: string;
    arkham_cards_campaigns: ArkhamCardsCampaign[]
    encounter_sets: string[]
    arkham_cards_scenarios: string[]
  }
}