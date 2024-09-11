
import { identity, prop } from "ramda";

import { CacheType } from "@/types/cache";
import { cache, getCustomEncountersSetFromCache, getCustomPacksFromCache, getEncountersFromCache } from "@/util/cache";

import { NO_MAIN_CYCLE_CODES, SPECIAL_CAMPAIGN_TYPES } from "@/api/arkhamDB/constants";
import { IDatabase } from "@/types/database";
import { getCampaignsFromCache, getCyclesFromCache, getPacksFromCache } from "@/util/cache";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";

import { toMainCampaign } from "./toMainCampaign";
import { cacheDatabaseEncounterSets } from "./cacheDatabaseEncounterSets";
import { packToCampaign } from "./packToCampaign";
import { toCustomCampaign } from "./toCustomCampaigns";

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
  console.log('caching database custom campaigns...');

  const campaigns = getCampaignsFromCache();
  const cycles = getCyclesFromCache();
  const customPacks = getCustomPacksFromCache();
  const customEncounterSets = getCustomEncountersSetFromCache();
  const customCodes = customEncounterSets.map(prop('code'));

  const iconDB = createIconDB();
  
  return campaigns
    .filter(({ is_custom, id }) => is_custom || customCodes.includes(id))
    .map(toCustomCampaign({
      cycles,
      customPacks,
      iconDB
    }));
}

export const getMainCampaigns = () => {
  console.log('caching database main campaigns...');

  const campaigns = getCampaignsFromCache();
  const cycles = getCyclesFromCache();
  const encounters = getEncountersFromCache();
  const iconDB = createIconDB();

  return cycles.filter(
    ({ code }) => !NO_MAIN_CYCLE_CODES.includes(code)
  )
  .map(toMainCampaign({
    campaigns,
    encounters,
    iconDB
  }));
}

export const getOfficialPackCampaigns = (): IDatabase.Campaign[] => {
  console.log('caching database official campaigns...');

  const campaigns = getCampaignsFromCache();
  const packs = getPacksFromCache();
  const encounters = getEncountersFromCache();

  const iconDB = createIconDB();

  const packCampaigns = packs.filter(
      ({ cycle_code }) => SPECIAL_CAMPAIGN_TYPES.includes(cycle_code)
    )
    .map(packToCampaign({
      campaigns,
      encounters,
      iconDB
    }))
    .filter(identity);

  return packCampaigns as IDatabase.Campaign[];
}