import { IDatabase } from '@/types/database'
import { ICache } from '@/types/cache';
import { prop } from 'ramda';

export const CUSTOM_POSITION_OFFSET = 200;

let position = 1;

export type CustomStoryType = 
  'campaign' | 
  'standalone' | 
  'challenge' | 
  'side_campaign' | 
  'side_story' 
  'parallel';

export type CreateCustomContentOptions = {
  scenarios?: Array<Omit<
      IDatabase.StoryScenario, 
      'header' | 
      'full_name' |
      'campaign_id'
    > & {
      campaign_id?: string
      header?: string
      full_name?: string 
    }>, 
  encounterSets?: Omit<
    IDatabase.EncounterSet, 
    'synonyms' | 
    'is_canonical' | 
    'is_official'
  >[]
  story: Omit<
      IDatabase.Story, 
      'type' |
      'scenario_encounter_sets' |
      'encounter_sets' |
      'extra_encounter_sets' |
      'investigators' |
      'is_size_supported'
    > & {
      type: CustomStoryType,
      scenario_encounter_sets?: string[]
      encounter_sets?: string[]
      extra_encounter_sets?: string[]
      investigators?: ICache.PackInvestigator[]
      is_size_supported?: boolean
    }
}

export const createCustomContent = (options: CreateCustomContentOptions) => {
  const { 
    encounterSets = [],
  } = options;
  const { name, code, type } = options.story;

  const cycleCode = type.includes('campaign') ? 'zcam' : 'zsid';

  const baseData = {
    cycle_code: cycleCode,
    is_canonical: false,
    is_official: false
  }

  const source = ICache.Source.ARKHAM_DIVIDER;
  const pack: ICache.Pack = {
    ...baseData,
    code,
    name,
    source,
    position: CUSTOM_POSITION_OFFSET + position++
  }
  
  const packEncounterSetBase = {
    ...baseData,
    pack_code: code,
    synonyms: [],
  }

  const scenarios: IDatabase.StoryScenario[] = options.scenarios ? options.scenarios.map(
    scenario => ({
      ...scenario,
      campaign_id: code,
      full_name: scenario.full_name || scenario.scenario_name,
      header: scenario.header || scenario.scenario_name
    })
  ) : [];

  const campaignScenarios = scenarios.length > 0 ? 
    scenarios.map(prop('id')) :
    [code];

  const campaign: IDatabase.StoryCampaign = {
    id: code,
    name,
    scenarios: campaignScenarios,
    icon: code
  }

  const encounters: IDatabase.EncounterSet[] = encounterSets.map(
      encunterSet => ({
        ...encunterSet,
        ...packEncounterSetBase,
        icon: encunterSet.icon || encunterSet.code,
      })
    )

  const requiredEncounters = options.story.encounter_sets || 
    encounters.map(prop('code'))

  const story: IDatabase.Story = {
    ...options.story,
    campaigns: options.story.campaigns || [campaign],
    is_size_supported: options.story.is_size_supported || false,
    encounter_sets: requiredEncounters,
    scenario_encounter_sets: options.story.scenario_encounter_sets || campaignScenarios,
    extra_encounter_sets: options.story.extra_encounter_sets || [],
    investigators: options.story.investigators || []
  }

  return {
    pack,
    encounterSets: encounters,
    story
  }
}