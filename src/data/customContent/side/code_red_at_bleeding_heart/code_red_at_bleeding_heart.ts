import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'code_red_at_bleeding_heart',
    type:'side_story',
    name: 'Code Red at Bleeding Heart',
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
              link: 'https://github.com/ArkhamDotCards/coderedatbleedingheart',
            }
          ]
        },
        {
          language: 'ru',
          links: [
            {
              link: 'https://drive.google.com/drive/mobile/folders/1AGkjAiK_KAjRnGQIixi8v3lMJP-ktj1W/1hBHXIPmlJaAYxEviVv2ujedC9WDZaM-_?sort=13&direction=a',
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
      id: 'code_red_at_bleeding_heart',
      scenario_name: 'Code Red at Bleeding Heart',
      icon: 'code_red_at_bleeding_heart_set'
    }
  ],
  encounterSets: [
    {
      code: 'graveyard_shift',
      name: 'Graveyard Shift',
    }
  ],
  icons: [
    {
      icon: 'code_red_at_bleeding_heart',
      width: 658,
      height: 1686
    },
    {
      icon: 'code_red_at_bleeding_heart_set',
      width: 651,
      height: 590
    },
    {
      icon: 'graveyard_shift',
      width: 751,
      height: 690
    }
  ]
})