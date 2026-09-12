import { createCustomContent } from '@/components/custom/createCustomContent';
import encounterSets from './encounterSets.json';
import icons from './icons.json';
import scenarios from './scenarios.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'betrayal_at_the_mountains_of_madness',
    type: 'side_campaign',
    name: 'Betrayal at the Mountains of Madness',
    custom_content: {
      creators: [
        {
          name: 'Tim Fletcher',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/betrayal-at-the-mountains-of-madness/'
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
