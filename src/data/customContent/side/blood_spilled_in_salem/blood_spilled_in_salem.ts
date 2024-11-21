
import { createCustomContent } from '@/components/custom/createCustomContent';

export default createCustomContent({
  dir: __dirname,
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
  scenarios: [
    {
      id: 'blood_spilled_in_salem',
      icon: 'blood_spilled_in_salem_set',
      scenario_name: 'Blood Spilled in Salem'
    }
  ],
  encounterSets: [
    {
      code: 'atrocities',
      name: 'Atrocities'
    }
  ],
  icons: [
    {
      icon: "blood_spilled_in_salem",
      width: 34.22,
      height: 32.331
    },
    {
      icon: "atrocities",
      width: 39.646,
      height: 30.748
    },
    {
      icon: "blood_spilled_in_salem_set",
      width: 31.126,
      height: 32.387
    }
  ]
});