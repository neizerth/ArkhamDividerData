
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'north_country_cycle',
    type: 'side_campaign',
    name: 'North Country Cycle',
    custom_content: {
      creator: 'Tim Cox',
      download_link: {
        en: 'https://arkhamcentral.com/index.php/north-country-cycle-arkham-horror-lcg-adventure/'
      }
    }
  },
  scenarios: [
    {
      id: 'wrotham_backcountry',
      scenario_name: 'Wrotham Backcountry',
      number_text: 'I',
      number: 1,
    },
    {
      id: 'wrotham_township',
      scenario_name: 'Wrotham Township',
      number_text: 'II',
      number: 2,
    },
    {
      id: 'north_woods',
      scenario_name: 'North Woods',
      number_text: 'III',
      number: 3,
    }
  ],
  encounterSets: [
    {
      name: 'Fire Cult',
      code: 'fire_cult'
    },
    {
      name: 'Blazing Fire',
      code: 'blazing_fire'
    },
    {
      name: 'Wrotham Sheriff',
      code: 'wrotham_sheriff'
    },
    {
      name: 'Burning Ground',
      code: 'burning_ground'
    }
  ],
  icons: [
    {
      icon: 'blazing_fire',
      width: 33.141,
      height: 33.082
    },
    {
      icon: 'burning_ground',
      width: 29.9,
      height: 32.812
    },
    {
      icon: 'fire_cult',
      width: 27.78,
      height: 25.362
    },
    {
      icon: 'north_woods',
      width: 29.635,
      height: 30.547
    },
    {
      icon: 'north_woods-original',
      width: 29.635,
      height: 30.547
    },
    {
      icon: 'wrotham_backcountry',
      width: 30.291,
      height: 34.37
    },
    {
      icon: 'wrotham_township',
      width: 29.899,
      height: 30.351
    },
    {
      icon: 'wrotham_sheriff',
      width: 28.377,
      height: 32.504
    },
    {
      icon: 'north_country_cycle',
      width: 27.994,
      height: 18.418
    }
  ]
});