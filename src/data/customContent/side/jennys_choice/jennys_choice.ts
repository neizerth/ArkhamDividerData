
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  story: {
    code: 'jennys_choice',
    type: 'side_story',
    name: 'Jenny\'s Choice',
    custom_content: {
      creator: 'Seth Oakman',
      download_link: {
        en: 'https://arkhamcentral.com/index.php/jennys-choice/'
      }
    }
  },
  encounterSets: [
    {
      code: 'lost_cathedral',
      name: 'Lost Cathedral'
    }
  ]
});