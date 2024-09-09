import { CacheType } from "../../types/cache";
import { cache } from "../../util/cache";

import { NO_MAIN_CYCLE_CODES, SPECIAL_CAMPAIGN_TYPES } from "../../api/arkhamDB/constants";
import { toMainCampaign } from "./toMainCampaign";
import { cacheDatabaseEncounterSets } from "./cacheDatabaseEncounterSets";
import { packToCampaign } from "./packToCampaign";
import { identity, propEq } from "ramda";
import { toCustomCampaign } from "./toCustomCampaigns";
import { IDatabase } from "../../types/database";
import { getCampaignsFromCache, getCyclesFromCache, getPacksFromCache } from "../../util/cache";
import { createIconDB } from "@/components/icons/IconDB";

export const cacheDatabase = async () => {
  console.log('caching database...');
  cacheDatabaseEncounterSets();
  cacheDatabaseCampaigns();
}

export const cacheDatabaseCampaigns = () => {
  console.log('caching database campaigns...');

  const data = [
    ...getMainCampaigns(),
    ...getOfficialPackCampaigns(),
    ...getCustomCampaigns()
  ];

  cache(CacheType.DATABASE_CAMPAIGNS, data);
}

export const getCustomCampaigns = () => {
  const campaigns = getCampaignsFromCache();
  const cycles = getCyclesFromCache();

  const iconDB = createIconDB();
  
  return campaigns
    .filter(propEq(true, 'is_custom'))
    .map(toCustomCampaign({
      cycles,
      iconDB
    }));
}



export const getMainCampaigns = () => {
  const campaigns = getCampaignsFromCache();
  const cycles = getCyclesFromCache();
  const iconDB = createIconDB();

  return cycles.filter(
    ({ code }) => !NO_MAIN_CYCLE_CODES.includes(code)
  )
  .map(toMainCampaign({
    campaigns,
    iconDB
  }));
}

export const getOfficialPackCampaigns = (): IDatabase.Campaign[] => {
  const campaigns = getCampaignsFromCache();
  const packs = getPacksFromCache();

  const iconDB = createIconDB();

  const packCampaigns = packs.filter(
      ({ cycle_code }) => SPECIAL_CAMPAIGN_TYPES.includes(cycle_code)
    )
    .map(packToCampaign({
      campaigns,
      iconDB
    }))
    .filter(identity);

  return packCampaigns as IDatabase.Campaign[];
}