
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'stranger_things',
    type: 'side_story',
    name: 'Stranger Things',
    custom_content: {
      creator: 'Ian Martin',
      download_link: {
        en: 'https://arkhamcentral.com/index.php/stranger-things-for-arkham-horror-lcg/'
      }
    }
  },
  scenarios: [
    {
      id: 'stranger_things',
      icon: 'stranger_things_set',
      scenario_name: 'Stranger Things'
    }
  ],
  encounterSets: [
    {
      code: 'upside_down',
      name: 'Upside Down'
    }
  ],
  icons: [
    {
      icon:'stranger_things',
      width: 37,
      height: 19
    },
    {
      icon: 'upside_down',
      width: 23.3,
      height: 29.8
    },
    {
      icon: 'stranger_things_set',
      width: 28,
      height: 28
    }
  ]
});