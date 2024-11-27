
import { createCustomContent } from '@/components/custom/createCustomContent';
import { link } from 'fs';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'return_to_the_wendigo',
    type: 'side_story',
    name: 'Return to the Wendigo',
    custom_content: {
      creators: [
        {
          name: 'Vinn Quest',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://github.com/ArkhamDotCards/returntothewendigo',
            }
          ]
        },
        {
          language: 'ru',
          links: [
            {
              link: 'https://drive.google.com/drive/folders/1XskT721FC4ieFApbbWw7uyaSOsOevQgH',
              translated_by: [
                {
                  name: '@Renegat_693',
                  link: 'https://t.me/Renegat_693'
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
  scenarios: [
    {
      id: 'return_to_the_wendigo',
      scenario_name: 'Return to the Wendigo',
      icon: 'return_to_the_wendigo_set'
    }
  ],
  encounterSets: [
    {
      code: 'curse_of_the_wendigo',
      name: 'Curse of the Wendigo'
    },
    {
      code: 'fearsome_fates',
      name: 'Fearsome Fates'
    },
    {
      code:'spoils_of_hanninah',
      name: 'Spoils of Hanninah'
    }
  ],
  icons: [
    {
      icon: 'return_to_the_wendigo',
      width: 250,
      height: 250
    },
    {
      icon: 'return_to_the_wendigo-return_to_the_wendigo_set',
      width: 220,
      height: 237
    },
    {
      icon: 'return_to_the_wendigo-curse_of_the_wendigo',
      width: 242,
      height: 241
    },
    {
      icon: 'return_to_the_wendigo-fearsome_fates',
      width: 192,
      height: 236
    },
    {
      icon: 'return_to_the_wendigo-spoils_of_hanninah',
      width: 241,
      height: 196
    }
  ]
});