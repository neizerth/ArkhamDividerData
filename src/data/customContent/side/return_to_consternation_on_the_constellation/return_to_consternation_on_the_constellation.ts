import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'return_to_consternation_on_the_constellation',
    type: 'side_story',
    name: 'Return to Constellation on the Constellation',
    custom_content: {
      creators: [
        {
          name: 'Ian Martin',
        },
        {
          name: 'Scott Armstrong'
        },
        {
          name: 'Nicholas Kory'
        },
        {
          name: 'Sean Switajewski'
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://github.com/ArkhamDotCards/returntoconsternationontheconstellation',
            }
          ]
        },
        {
          language: 'ru',
          links: [
            {
              link: 'https://drive.google.com/drive/folders/1fh4q8XXcZ4UjoT8XdVWnQnwMK9RV0ZHf',
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
      id: 'return_to_consternation_on_the_constellation',
      scenario_name: 'Return to Constellation on the Constellation',
      icon: 'return_to_consternation_on_the_constellation_set'
    }
  ],
  encounterSets: [
    {
      code: 'save_our_ship',
      name: 'Save Our Ship',
    }
  ],
  icons: [
    {
      icon:'return_to_consternation_on_the_constellation',
      width: 224,
      height: 238
    },
    {
      icon:'return_to_consternation_on_the_constellation_set',
      width: 240,
      height: 228
    },
    {
      icon:'save_our_ship',
      width: 168,
      height: 221,
      circled: true
    }
  ]
})