export const enum CacheType {
  SCENARIOS = 'scenarios',
  CAMPAIGNS = 'campaigns',
  
  CUSTOM_PACKS = 'packs.custom',
  CUSTOM_CYCLES = 'cycles.custom',
  CUSTOM_ENCOUNTER_SETS = 'encounterSets.custom',

  TRANSLATED_CAMPAIGNS = 'translated.campaigns',

  ICONS_PROJECT = 'icons.project',
  ICONS_MAPPING = 'icons.mapping',

  CYCLES = 'cycles',
  PACKS = 'packs',
  ENCOUNTERS = 'encounters',
  ENCOUNTER_SETS = 'encounterSets',

  DATABASE_CAMPAIGNS = 'database.campaigns',
  DATABASE_ENCOUNTER_SETS = 'database.encounterSets',
  
  CAMPAIGN_LANGUAGES = 'languages.campaign',
  CORE_LANGUAGES = 'languages.core',

  COMMON_TRANSLATION = 'commonTranslation',
  CORE = 'core',
}

export namespace ICache {
  export enum Source {
    ARKHAMDB = 'adb',
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

  export type Pack = {
    code: string;
    name: string; 
    cycle_code: string
    source: Source
    is_canonical: boolean
    is_official: boolean
    date_release?: string
    cgdb_id?: number
  }

  export type EncounterSet = {
    name: string;
    code: string;
  }

  export type Adventure = {
    
  }
}