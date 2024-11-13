
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
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
  encounterSets: [
    {
      code: 'stranger_things_set',
      name: 'Stranger Things'
    },
    {
      code: 'upside_down',
      name: 'Upside Down'
    }
  ]
});