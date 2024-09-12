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

  export type Scenario = {
    id: string
    campaign_id: string;
    encounter_sets: string[]
    scenario_name: string
    full_name: string
    header: string
    icon?: string
  }
  
  export type Story = {
    name: string
    code: string
    campaigns: string[]
    pack_codes: string[]
    // cycle_code: string
    // pack_codes: string[]
    type: string;
    icon?: string
    encounter_sets: string[]
    extra_encounter_sets: string[]
    is_size_supported: boolean
    
    // scenarios: string[]
    // campaigns: string[]
    return_to_code?: string
    custom_content?: CustomContent

    is_canonical: boolean
    is_official: boolean
  }
}