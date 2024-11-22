
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'betrayal_at_the_mountains_of_madness',
    type: 'side_story',
    name: 'Betrayal at the Mountains of Madness',
    custom_content: {
      creators: [
        {
          name: 'Tim Fletcher',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://arkhamcentral.com/index.php/betrayal-at-the-mountains-of-madness/'
            }
          ]
        }
      ]
    }
  },
  icons: [
    {
      icon: "betrayal_at_the_mountains_of_madness",
      width: 39.371,
      height: 28.093
    }
  ]
});