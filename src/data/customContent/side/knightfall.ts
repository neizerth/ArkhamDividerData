
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
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
  ]
});