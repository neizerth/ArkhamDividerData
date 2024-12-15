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
              link: "https://t.me/arkhamhorrorlcg_ru_chat/3258/816212",
              translated_by: [
                {
                  name: "@ceifer",
                  link: "https://t.me/ceifer"
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