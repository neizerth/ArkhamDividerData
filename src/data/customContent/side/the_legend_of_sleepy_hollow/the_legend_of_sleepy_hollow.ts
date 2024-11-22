
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
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
        }
      ]
    }
  }
});