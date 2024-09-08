import { 
  getCampaignsFromCache, 
  getCyclesFromCache, 
  getDatabaseEncounterSets,
  getPacksFromCache, 
} from "@/components";

import { CacheType } from "@/types/cache";
import { cache } from "@/util/cache";

import { NO_MAIN_CYCLE_CODES, SIDE_STORY_CODE, SPECIAL_CAMPAIGN_TYPES } from "@/api/arkhamDB/constants";
import { toMainCampaign } from "./toMainCampaign";
import { cacheDatabaseEncounterSets } from "./cacheDatabaseEncounterSets";
import { packToCampaign } from "./packToCampaign";
import { identity, prop, propEq } from "ramda";

export const cacheDatabase = async () => {
  console.log('caching database...');
  cacheDatabaseEncounterSets();
  cacheDatabaseCampaigns();
}

export const cacheDatabaseCampaigns = () => {
  console.log('caching database campaigns...');
  const encounterSets = getDatabaseEncounterSets();
  const cycles = getCyclesFromCache();
  const campaigns = getCampaignsFromCache();
  const packs = getPacksFromCache();

  const mainCycles = cycles.filter(
    ({ code }) => !NO_MAIN_CYCLE_CODES.includes(code)
  );

  const mainCampaigns = mainCycles
    .map(toMainCampaign({
      campaigns,
      encounterSets
    }));
  
  const specialPacks = packs.filter(
    ({ cycle_code }) => SPECIAL_CAMPAIGN_TYPES.includes(cycle_code)
  )
  
  const packCampaigns = specialPacks
    .map(packToCampaign({
      campaigns,
      official: true
    }))
    .filter(identity);

  const data = [
    ...mainCampaigns,
    ...packCampaigns
  ];

  cache(CacheType.DATABASE_CAMPAIGNS, data);
}