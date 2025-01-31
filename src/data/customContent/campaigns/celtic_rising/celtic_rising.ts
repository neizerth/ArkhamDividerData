
import { createCustomContent } from '@/components/custom/createCustomContent';
import icons from './icons.json';
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'celtic_rising',
    type: 'side_campaign',
    name: 'Celtic Rising',
    custom_content: {
      creators: [
        {
          name: 'QggOne'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://mysteriouschanting.wordpress.com/2022/07/20/celtic-rising-campaign/'
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