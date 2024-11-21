
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'the_collector',
    type: 'side_story',
    name: 'The Collector',
    custom_content: {
      creator: 'Mike Hutchinson',
      download_link: {
        en: 'https://arkhamcentral.com/index.php/the-collector-arkham-horror-lcg-adventure/',
        it: 'https://arkhamcentral.com/index.php/the-collector-arkham-horror-lcg-adventure/'
      }
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