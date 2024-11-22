
import { createCustomContent } from '@/components/custom/createCustomContent';
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';
import icons from './icons.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'darkham_horror',
    type: 'side_campaign',
    name: 'Darkham Horror',
    custom_content: {
      creators: [
        {
          name: 'Kenneth Siu'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://github.com/Kenneth-Siu/darkham-horror-card-images'
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