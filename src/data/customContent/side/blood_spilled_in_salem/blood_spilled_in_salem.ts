
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'blood_spilled_in_salem',
    type: 'side_story',
    name: 'Blood Spilled in Salem',
    custom_content: {
      creators: [
        {
          name: 'Colin Towle',
        }
      ], 
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/blood-spilled-salem-fan-created-content-for-arkham-horror-lcg/'
            }
          ]
        },
        {
          language: 'ru',
          links: [
            {
              translated_by: [
                {
                  name: '@Renegat_693',
                  link: 'https://t.me/Renegat_693'
                },
                {
                  name: '@gigabytesergey',
                  link: 'https://t.me/gigabytesergey'
                }
              ],
              link: "https://drive.google.com/drive/folders/1wotg6USgu72ZfQLi1hq7xDAysnXebkt_"
            }
          ]
        }
      ]
    }
  },
  scenarios: [
    {
      id: 'blood_spilled_in_salem',
      icon: 'blood_spilled_in_salem_set',
      scenario_name: 'Blood Spilled in Salem'
    }
  ],
  encounterSets: [
    {
      code: 'atrocities',
      name: 'Atrocities'
    }
  ],
  icons: [
    {
      icon: "blood_spilled_in_salem",
      width: 34.22,
      height: 32.331
    },
    {
      icon: "atrocities",
      width: 39.646,
      height: 30.748
    },
    {
      icon: "blood_spilled_in_salem_set",
      width: 31.126,
      height: 32.387
    }
  ]
});