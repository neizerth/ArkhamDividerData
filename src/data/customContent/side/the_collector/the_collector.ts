
import { createCustomContent } from '@/components/custom/createCustomContent';
import { link } from 'fs';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_collector',
    type: 'side_story',
    name: 'The Collector',
    custom_content: {
      creators: [
        {
          name: 'Mike Hutchinson',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/the-collector-arkham-horror-lcg-adventure/',
            }
          ]
        },
        {
          language: 'it',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/the-collector-arkham-horror-lcg-adventure/',
            }
          ]
        }
      ]
    }
  },
  icons: [
    {
      icon: 'the_collector',
      width: 23,
      height: 29
    }
  ]
});