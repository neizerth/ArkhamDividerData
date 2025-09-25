import { createCustomContent } from "@/components/custom/createCustomContent";
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';

export default createCustomContent({
  dir: __dirname,
  prefix: false,
  story: {
    code: 'zcxc',
    type: 'side_campaign',
    name: 'Circus Ex Mortis',
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
              link: 'https://mysteriouschanting.wordpress.com/2023/08/21/circus-ex-mortis-campaign-and-player-expansion/'
            }
          ]
        }
      ]
    }
  },
  scenarios,
  encounterSets,
});