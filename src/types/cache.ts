export const enum CacheType {
  SCENARIOS = 'scenarios',
  STANDALONE_SCENARIOS = 'standaloneScenarios',
  CAMPAIGNS = 'campaigns',

  ENCOUNTER_SETS = 'encounterSets',
  SCENARIO_ENCOUNTER_SETS = 'encounterSets.scenario',
  SIDE_SCENARIOS = 'side.scenario',
  CAMPAIGN_LINKS = 'links.campaign',

  PACK_ENCOUNTER_SETS = 'encounterSets.pack',

  ICONS = 'icons.project',
  ICONS_INFO = 'icons.info',
  ICONS_MAPPING = 'icons.mapping',

  DATABASE_CAMPAIGNS = 'database.campaigns',
  DATABASE_ENCOUNTER_SETS = 'database.encounterSets',

  DATABASE_STORIES = 'database.stories',
  
  CUSTOM_PACKS = 'packs.custom',
  CUSTOM_CYCLES = 'cycles.custom',

  CYCLES = 'cycles',
  PACKS = 'packs',

  CUSTOM_ENCOUNTER_SETS = 'encounterSets.custom',

  TRANSLATED_CAMPAIGNS = 'translated.campaigns',
  TRANSLATED_SCENARIOS = 'translated.scenarios',

  ENCOUNTERS = 'encounters',
  
  CAMPAIGN_LANGUAGES = 'languages.campaign',
  CORE_LANGUAGES = 'languages.core',

  COMMON_TRANSLATION = 'commonTranslation',
  CORE = 'core',
}

export namespace ICache {

  export type IconInfo = {
    icon: string
    encodedCode: string
    unicode: string
  }

  export enum Source {
    ARKHAMDB = 'arkham-db',
    ARKHAM_CARDS = 'arkham-cards'
  }

  export type Cycle = {
    code: string;
    name: string;
    position: number;
    source: Source;
    size?: number;
    is_canonical: boolean;
    is_official: boolean;
  }

  export type StandaloneScenario = {
    scenario_id: string
    arkham_cards_campaign_id: string
    type: string
  }

  export type Pack = {
    code: string;
    name: string; 
    cycle_code: string
    source: Source
    date_release?: string
    cgdb_id?: number
    position: number;
    is_canonical: boolean;
    is_official: boolean;
  }

  export type PackEncounterSet = {
    cycle_code: string;
    pack_code: string;
    encounter_set_code: string
    source: Source
    size?: number;
  }

  export type ScenarioEncounterSet = {
    campaign_id: string;
    scenario_id: string;
    cycle_code: string;
    pack_code: string;
    encounter_set_code: string
    is_extra: boolean
  }

  export type SideScenario = {
    campaign_id?: string;
    scenario_id?: string;
    pack_code?: string;
    cycle_code?: string;
  }

  export type CampaignLink = {
    campaign_id: string;
    pack_code?: string;
    cycle_code?: string;
  }

  export type EncounterSet = {
    name: string
    code: string
    synonyms: string[]
  }
}