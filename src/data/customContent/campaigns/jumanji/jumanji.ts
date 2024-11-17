
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
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
  ],
  icons: [
    {
      icon: 'bats',
      width: 28.979,
      height: 16.478
    },
    {
      icon: 'call_of_jumanji',
      width: 23.676,
      height: 26.29
    },
    {
      icon: 'force_of_nature',
      width: 21.903,
      height: 29.628
    },
    {
      icon: 'game_night',
      width: 23.354,
      height: 24.663
    },
    {
      icon: 'gameplay',
      width: 23.9,
      height: 23.373
    },
    {
      icon: 'home_invasion',
      width: 26.21,
      height: 29.751
    },
    {
      icon: 'hunter',
      width: 25.179,
      height: 25.273
    },
    {
      icon: 'jungle_spirits',
      width: 29.781,
      height: 25.853
    },
    {
      icon: 'lions',
      width: 27.066,
      height: 31.455
    },
    {
      icon: 'plants',
      width: 25.206,
      height: 28.247
    },
    {
      icon: 'primal_influence',
      width: 26.426,
      height: 25.319
    },
    {
      icon: 'spreading_wilds',
      width: 27.336,
      height: 26.596
    },
    {
      icon: 'urban_jungle',
      width: 23.2,
      height: 26.707
    },
    {
      icon: 'wilderness_training',
      width: 27.371,
      height: 23.327
    },
    {
      icon: 'jumanji',
      width: 32.887,
      height: 29.708
    }
  ]
});