
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
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
  ]
});