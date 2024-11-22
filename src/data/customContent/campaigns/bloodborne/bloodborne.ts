import { createCustomContent } from '@/components/custom/createCustomContent';
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';
import icons from './icons.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'bloodborne',
    type: 'side_campaign',
    name: 'Bloodborne: The City of the Unseen',
    custom_content: {
      creators: [
        {
          name: 'exhaled innards'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://mysteriouschanting.wordpress.com/2024/02/18/bloodborne-the-city-of-the-unseen/'
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