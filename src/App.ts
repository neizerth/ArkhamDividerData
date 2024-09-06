import fs from 'fs';
import path from 'path';
import * as R from 'ramda';

import { getCampaignsCache } from "@/components/cache/campaigns/getCampaignsCache";
import { getIconsMapping } from "@/components/cache/encounterSets/getIconsMapping";
import { ROOT_DIR } from './config/app';
import { getCyclesCache } from './components/cache/cycles/getCyclesCache';


export class App {
  async run() {
    console.log('starting application');
    const { cycles, packs, encounterSets } = await getCyclesJSONCache();
    this.cache('cycles', cycles);
    this.cache('packs', packs);
    this.cache('encounterSets', encounterSets);

    // const campaignsRaw = await loadСampaigns('en');

    return;
    const iconMapping = await getIconsMapping();

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
  cache<T>(name: string, data: object) {
    const contents = JSON.stringify(data);

    const filename = path.join(`${ROOT_DIR}/build/${name}.json`);

    fs.writeFileSync(filename, contents);
  }
}