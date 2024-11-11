import { IDatabase } from '@/types/database'
import { ICache } from '@/types/cache';

export const CUSTOM_POSITION_OFFSET = 200;

export type CreateCustomContentOptions = {
  position: number
  cycle_code: 'szid' | 'zcam'
  encounterSets: Omit<
    IDatabase.EncounterSet, 
    'synonyms'
  >[]
  story: Omit<
      IDatabase.Story, 
      'code' | 
      'encounter_sets' |
      'extra_encounter_sets'
    > & {
      code: `-ad-${string}`
      scenario_encounter_sets?: string[]
      encounter_sets?: string[]
      extra_encounter_sets?: string[] 
    }
}

export const createCustomContent = (options: CreateCustomContentOptions) => {
  const { cycle_code, position } = options;
  const { code, name } = options.story;

  const source = ICache.Source.ARKHAM_DIVIDER;
  const pack: ICache.Pack = {
    cycle_code,
    code,
    name,
    source,
    is_canonical: false,
    is_official: false,
    position: CUSTOM_POSITION_OFFSET + position
  }
  
  const packEncounterSets: IDatabase.EncounterSet[] = options.encounterSets.map(encunterSet => ({
    ...encunterSet,
    source,
    cycle_code,
    pack_code: code,
    synonyms: []
  }));

  //const scenarioEncounters

  const story = {
    ...options.story,
    
  }
}