import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
  story: {
    code: "winter_winds",
    type: "side_campaign",
    name: "Winter Winds",
    custom_content: {
      creators: [
        {
          name: "@myriadantitrust",
          link: "https://twitter.com/myriadantitrust"
        },
        {
          name: "Arkham.cards team",
          link: "https://discord.gg/xEZ5FwKrNS"
        }
      ],
      download_links: [

      ]
    }
  },
  scenarios: [
    {
      id: "frozen_tracks",
      scenario_name: "Frozen Tracks"
    },
    {
      id: "stranded_in_the_urals",
      scenario_name: "Stranded in the Urals"
    },
    {
      id: "the_forgotten_village",
      scenario_name: "The Forgotten Village"
    }
  ]
});