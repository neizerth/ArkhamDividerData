
import { createCustomContent } from '@/components/custom/createCustomContent';
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';
import icons from './icons.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'ages_unwound',
    type: 'side_campaign',
    name: 'Ages Unwound',
    custom_content: {
      creators: [
        {
          name: 'Olivia Juliet'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://mysteriouschanting.wordpress.com/2021/11/10/ages-unwound-campaign/'
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