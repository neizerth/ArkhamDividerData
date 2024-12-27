
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_festival',
    type: 'side_story',
    name: 'The Festival',
    custom_content: {
      creators: [
        {
          name: 'Matthew Heiti',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/the-festival-fan-created-content-for-arkham-horror-lcg/'
            }
          ]
        },
        {
          language: 'de',
          links: [
            {
              link: 'https://mpc.north101.co.uk/projects'
            }
          ]
        }
      ]
    }
  },
  encounterSets: [
    {
      code: 'the_festival_set',
      name: 'The Festival'
    }
  ],
  icons: [
    {
      icon: 'the_festival',
      width: 21,
      height: 40
    },
    {
      icon: 'the_festival_set',
      width: 34.5,
      height: 23.8
    }
  ]
});