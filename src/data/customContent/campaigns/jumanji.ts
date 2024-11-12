
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  story: {
    code: 'jumanji',
    type: 'side_campaign',
    name: 'Jumanji',
    custom_content: {
      creator: 'The Beard',
      download_link: {
        en: 'https://mysteriouschanting.wordpress.com/2022/06/21/jumanji-campaign/'
      }
    }
  },
  scenarios: [
    {
      id: 'home_invasion',
      scenario_name: 'Home Invasion',
      number_text: 'I',
      number: 1,
    },
    {
      id: 'urban_jungle',
      scenario_name: 'Urban Jungle',
      number_text: 'II',
      number: 2,
    },
    {
      id: 'game_night',
      scenario_name: 'Game Night',
      number_text: 'III',
      number: 3,
    },
    {
      id: 'force_of_nature',
      scenario_name: 'Force of Nature',
      number_text: 'IV',
      number: 4,
    }
  ],
  encounterSets: [
    {
      code: 'jumanji_set',
      name: 'Jumanji'
    },
    {
      code: 'call_of_jumanji',
      name: 'Call of Jumanji'
    },
    {
      code: 'bats',
      name: 'Bats'
    },
    {
      code: 'plants',
      name: 'Plants'
    },
    {
      code: 'spreading_wilds',
      name: 'Spreading Wilds'
    },
    {
      code: 'jungle_spirits',
      name: 'Jungle Spirits'
    },
    {
      code: 'lions',
      name: 'Lions'
    },
    {
      code: 'primal_influence',
      name: 'Primal Influence'
    },
    {
      code: 'wilderness_training',
      name: 'Wilderness Training'
    },
    {
      code: 'gameplay',
      name: 'Gameplay'
    },
    {
      code: 'hunter',
      name: 'Hunter'
    }
  ]
});