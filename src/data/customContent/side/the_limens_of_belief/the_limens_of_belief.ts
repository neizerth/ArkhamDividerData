
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_limens_of_belief',
    type: 'side_story',
    name: 'The Limens of Belief',
    custom_content: {
      creators: [
        {
          name: 'Dee',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/the-limens-of-belief-arkham-horror-lcg-adventure/'
            }
          ]
        }
      ]
    }
  },
  icons: [
    {
      icon: 'the_limens_of_belief',
      width: 39,
      height: 35
    }
  ]
});