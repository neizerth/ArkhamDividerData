
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_nameless_city',
    type: 'side_story',
    name: 'The Nameless City',
    custom_content: {
      creators: [
        {
          name: 'Niccolò Sbaraini',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/the-nameless-city/'
            }
          ]
        },
        {
          language: 'ru',
          links: [
            {
              link: 'https://cloud.mail.ru/public/ci4R/11e1eqN1o',
              translated_by: [
                {
                  name: '@ceifer',
                  link: 'https://t.me/ceifer'
                },
                {
                  name: '@gigabytesergey',
                  link: 'https://t.me/gigabytesergey'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  encounterSets: [
    {
      name: 'Nameless City',
      code: 'nameless_city',
      icon: 'the_nameless_city'
    },
    {
      name: 'Cosmic Truth',
      code: 'cosmic_truth'
    },
    {
      name: 'Beyond The Unknown',
      code: 'beyond_the_unknown'
    },
    {
      name: 'Nameless Citizens',
      code: 'nameless_citizens'
    },
    {
      name: 'Ancient Hazards',
      code: 'ancient_hazards'
    },
    {
      name: 'Hellish Guests',
      code: 'hellish_guests'
    }
  ],
  icons: [
    {
      icon: 'ancient_hazards',
      width: 30,
      height: 31
    },
    {
      icon: 'beyond_the_unknown',
      width: 28,
      height: 28
    },
    {
      icon: 'cosmic_truth',
      width: 34,
      height: 32
    },
    {
      icon: 'hellish_guests',
      width: 36,
      height: 34
    },
    {
      icon: 'nameless_citizens',
      width: 33,
      height: 31
    },
    {
      icon: 'the_nameless_city',
      width: 33,
      height: 38
    }
  ]
});