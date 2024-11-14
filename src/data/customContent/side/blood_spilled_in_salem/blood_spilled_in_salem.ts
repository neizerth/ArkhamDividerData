
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  story: {
    code: 'blood_spilled_in_salem',
    type: 'side_story',
    name: 'Blood Spilled in Salem',
    custom_content: {
      creator: 'Colin Towle',
      download_link: {
        en: 'https://arkhamcentral.com/index.php/blood-spilled-salem-fan-created-content-for-arkham-horror-lcg/'
      }
    }
  },
  encounterSets: [
    {
      code: 'blood_spilled_in_salem_set',
      name: 'Blood Spilled in Salem'
    },
    {
      code: 'atrocities',
      name: 'Atrocities'
    }
  ]
});