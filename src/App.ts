import { loadcampaigns } from "./api/arkhamCards";
import { getPacks } from "./api/arkhamDB";
import { getCampaignsCache } from "./components/cache/campaigns/getCampaignsCache";
import { getEncounterSetsCache } from "./components/cache/encounterSets/getEncounterSetsCache";
import { getIconsMapping } from "./components/cache/encounterSets/getIconsMapping";

export class App {
  async run() {
    console.log('starting application');
    const iconMapping = await getIconsMapping();
    const packs = await getPacks();
    const campaignsRaw = await loadcampaigns('en');

    const campaigns = getCampaignsCache({
      campaigns: campaignsRaw,
      iconMapping,
      packs
    });
    
    // const availableLanguages = 
    // const campaignEn = 

    // this.cache('encounterSet', getEncounterSetsCache);
    // getEncounterSetsCache();
  }
  cache<T>(name: string, data: () =>T) {

  }
}