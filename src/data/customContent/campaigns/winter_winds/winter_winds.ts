import { createCustomContent } from "@/components/custom/createCustomContent";
import scenarios from './scenarios.json';
import encounterSets from './encounterSets.json';
import icons from './icons.json';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: "winter_winds",
    type: "side_campaign",
    name: "Winter Winds",
    custom_content: {
      creators: [
        {
          name: "Nicholas Kory"
        }
      ],
      download_links: [
        {
          language: "en",
          links: [
            {
              link: "https://arkhamcentral.com/index.php/frozen-tracks-fan-created-content-for-arkham-horror-the-card-game/",
            }
          ]
        },
        {
          language: "ru",
          links: [
            {
              link: "https://disk.yandex.ru/d/sHrTKqMMTkHCcQ",
              translated_by: [
                {
                  name: "@Renegat_693",
                  link: "https://t.me/Renegat_693"
                },
                {
                  name: "@gigabytesergey",
                  link: "https://t.me/gigabytesergey"
                }
              ]
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