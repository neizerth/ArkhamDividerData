
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_legend_of_sleepy_hollow',
    type: 'side_story',
    name: 'The Legend of Sleepy Hollow',
    custom_content: {
      creators: [
        {
          name: 'The Beard',
        }
      ],
      download_links: [
        {
          language: 'en',
          links: [
            {
              link: 'https://mysteriouschanting.wordpress.com/2020/10/30/the-legend-of-sleepy-hollow/'
            }
          ]
        },
        {
          language: 'ru',
          links: [
            {
              link: 'https://t.me/arkhamhorrorlcg_ru_chat/3258/828312',
              translated_by: [
                {
                  name: '@ceifer',
                  link: 'https://t.me/ceifer'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  icons: [
    {
      icon: 'the_legend_of_sleepy_hollow',
      width: 37,
      height: 32
    }
  ]
});