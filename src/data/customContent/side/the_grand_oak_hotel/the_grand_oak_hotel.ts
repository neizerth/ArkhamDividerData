
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_grand_oak_hotel',
    type: 'side_story',
    name: 'The Grand Oak Hotel',
    custom_content: {
      creators: [
        {
          name: 'ArgusTheCat',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/grand-oak-hotel-player-created-adventure-for-arkham-horror-the-card-game/'
            }
          ]
        }
      ]
    }
  },
  icons: [
    {
      icon: 'the_grand_oak_hotel',
      width: 33,
      height: 33
    }
  ]
});