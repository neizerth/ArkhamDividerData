import { 
  getCampaignsFromCache, 
  getCyclesFromCache, 
  getDatabaseEncounterSets,
  getPacksFromCache, 
} from "@/components";

import { CacheType } from "@/types/cache";
import { cache } from "@/util/cache";

import { NO_MAIN_CYCLE_CODES, SIDE_STORY_CODE } from "@/api/arkhamDB/constants";
import { toMainCampaign } from "./toMainCampaign";
import { cacheDatabaseEncounterSets } from "../cacheDatabaseEncounterSets";
import { withCode } from "@/api/arkhamDB/criteria";
import { packToCampaign } from "./packToCampaign";
import { identity, prop, propEq } from "ramda";
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";

export const cacheDatabase = () => {
  cacheDatabaseEncounterSets();
  cacheCampaigns();
}

export const cacheCampaigns = () => {
  const encounterSets = getDatabaseEncounterSets();
  const cycles = getCyclesFromCache();
  const campaigns = getCampaignsFromCache();
  const packs = getPacksFromCache();

  const mainCycles = cycles.filter(
    ({ code }) => NO_MAIN_CYCLE_CODES.includes(code)
  );

  const mainCampaigns = mainCycles
    .map(toMainCampaign({
      campaigns,
      encounterSets
    }));
  
  const sidePacks = packs
    .filter(propEq(SIDE_STORY_CODE, 'campaign_type'))
  
  const sideCampaigns = sidePacks
    .map(packToCampaign({
      campaigns,
      official: true
    }))
    .filter(identity);

  const data = [
    ...mainCampaigns
  ];

  cache(CacheType.DATABASE_CAMPAIGNS, data);
}