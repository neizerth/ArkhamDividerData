import { Mapping } from "./common";

export namespace IDatabase {
  
  export type CustomContent = {
    creator: string;
    download_link: Mapping
  }

  export enum StoryType {
    PARALLEL = 'parallel',
    STANDALONE = 'standalone',
    SIDE = 'side_story',
    CHALLENGE = 'challenge',
    CAMPAIGN = 'campaign'
  }

  export type EncounterSet = {
    name: string;
    code: string;

    icon?: string;
    pack_code?: string;
    cycle_code?: string;
    synonyms: string[];
    size?: number;
    is_canonical: boolean;
    is_official: boolean;
  }
  
  export type Story = {
    id: string
    name: string
    cycle_code: string
    pack_codes: string[]
    type: StoryType
    icon?: string
    encounter_sets: string[]
    extra_encounter_sets: string[]
    is_size_supported: boolean
    is_canonical: boolean
    is_official: boolean
    campaign_type: string
    arkham_cards_scenarios: string[]
    return_set_code?: string
    custom_content?: CustomContent
  }
}