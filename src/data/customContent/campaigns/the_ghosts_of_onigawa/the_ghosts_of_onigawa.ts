import { createCustomContent } from '@/components/custom/createCustomContent';
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';
import icons from './icons.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_ghosts_of_onigawa',
    type: 'side_story',
    name: 'The Ghosts of Onigawa',
    custom_content: {
      creators: [
        {
          name: '@myriadantitrust',
          link: 'https://twitter.com/myriadantitrust'
        },
        {
          name: 'Arkham.cards team',
          link: 'https://discord.gg/xEZ5FwKrNS'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://github.com/ArkhamDotCards/theghostsofonigawa',
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