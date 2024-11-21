
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
  story: {
    code: 'knightfall',
    type: 'side_story',
    name: 'Knightfall',
    custom_content: {
      creator: 'Jake Rubio',
      download_link: {
        en: 'https://arkhamcentral.com/index.php/knightfall-a-batman-adventure-for-arkham-horror-the-card-game/'
      }
    }
  },
  encounterSets: [
    {
      code: 'fear_toxin',
      name: 'Fear Toxin',
    }
  ],
  icons: [
    {
      icon: 'knightfall',
      width: 38,
      height: 17
    },
    {
      icon: 'fear_toxin',
      width: 27,
      height: 37
    }
  ]
});