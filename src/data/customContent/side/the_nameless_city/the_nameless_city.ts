
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
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
        }
      ]
    }
  },
  encounterSets: [
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
  ]
});