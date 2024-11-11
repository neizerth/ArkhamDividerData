import { ICache } from '@/types/cache';
import { CustomStory, CustomPackEncounterSet } from '@/types/custom'
import { IDatabase } from '@/types/database'

const CYCLE_CODE = 'zsid';

export const pack = {

}

export const packEncounterSets: CustomPackEncounterSet[] = [
  {
    cycle_code: CYCLE_CODE,
    pack_code: '-ad-losh',
    encounter_set_code: '-ad-losh',
    source: ICache.Source.ARKHAM_DIVIDER,
  }
];

export const story: CustomStory = {
  code: '-ad-losh',
  name: "The Legend of Sleepy Hollow",
  type: IDatabase.StoryType.SIDE,
  investigators: [],
  custom_content: {
    creator: 'The Beard',
    download_link: {
      en: 'https://mysteriouschanting.wordpress.com/2020/10/30/the-legend-of-sleepy-hollow/'
    }
  },
  scenario_encounter_sets: [
    '-ad-losh'
  ],
  encounter_sets: [
    '-ad-losh'
  ],
  extra_encounter_sets: [],
  is_size_supported: false
};
