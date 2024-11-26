import { ICache } from "./cache";
import { Mapping } from "./common";

export namespace IDatabase {
  
  export type CustomContent = {
    creators: Array<{
      name: string
      link?: string
    }>
    download_links: Array<{
      language: string
      links: Array<{
        link: string
        name?: string,
        translated_by?: CustomContentTranslator[]
      }>
    }>
  }

  export type CustomContentTranslator = {
    name: string
    kind?: string
    link?: string
  }

  export enum StoryType {
    PARALLEL = 'parallel',
    STANDALONE = 'standalone',
    SIDE = 'side_story',
    SIDE_CAMPAIGN = 'side_campaign',
    CHALLENGE = 'challenge',
    CAMPAIGN = 'campaign',
    PROMO = 'promo'
  }

  export type EncounterSetType = {
    type: string;
    size: number;
  }

  export type EncounterSet = {
    name: string;
    code: string;

    icon?: string;
    pack_code?: string;
    cycle_code?: string;
    synonyms: string[];
    size?: number;
    types?: EncounterSetType[]
    is_canonical: boolean;
    is_official: boolean;
  }

  export type ScenarioEncounterSetGroup = {
    id: string;
    type: string
    title?: string
    aside?: boolean
    version_number: number
    version_text: string
    encounter_sets: string[]
    is_default: boolean
  }

  export type StoryScenario = {
    id: string
    campaign_id: string
    scenario_name: string
    full_name: string
    type?: string
    header: string
    number?: number
    number_text?: string
    part_text?: string
    part_number?: number
    icon?: string
    scenarios?: StoryScenario[]
    encounter_sets?: string[]
    extra_encounter_sets?: string[]
    encounter_set_groups?: ScenarioEncounterSetGroup[];
  }

  export type StoryCampaign = {
    id: string
    icon?: string
    name: string
    scenarios: string[]
    encounter_sets?: string[]
    extra_encounter_sets?: string[]
  }
  
  export type Story = {
    name: string
    code: string
    position?: number
    campaign_id?: string
    scenario?: StoryScenario
    scenarios?: StoryScenario[]
    campaigns?: StoryCampaign[]
    cycle_code?: string
    pack_code?: string
    pack_codes?: string[]
    type: string;
    icon?: string
    investigators: ICache.PackInvestigator[]
    scenario_encounter_sets: string[]
    encounter_sets: string[]
    extra_encounter_sets: string[]
    is_size_supported: boolean
    
    return_to_code?: string
    custom_content?: CustomContent

    is_canonical?: boolean
    is_official?: boolean
  }
}