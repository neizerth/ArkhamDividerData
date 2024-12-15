
import { createCustomContent } from '@/components/custom/createCustomContent';
import icons from './icons.json';
import encounterSets from './encounterSets.json';
import scenarios from './scenarios.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'jumanji',
    type: 'side_campaign',
    name: 'Jumanji',
    custom_content: {
      creators: [
        {
          name: 'The Beard'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://mysteriouschanting.wordpress.com/2022/06/21/jumanji-campaign/'
            }
          ]
        }
      ]
    }
  },
  scenarios,
  encounterSets,
  icons
});