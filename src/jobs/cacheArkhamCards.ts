import { cache } from "@/util/cache";
import { getCampaignsCache, getIconsMappingCache, getEncounterSetsCache } from "@/components"
import { CacheType } from "@/types/cache";

export const cacheArkhamCards = async () => {
  await cacheCampaigns();
  await cacheEncounterSets();
  await cacheIconMapping();
}

export const cacheCampaigns = async () => {
  console.log('caching Arkham Cards campaigns...');
  const campaigns = await getCampaignsCache();

  cache(CacheType.CAMPAIGNS, campaigns);
}

export const cacheIconMapping = async () => {
  console.log('caching Arkham Cards icons mapping...');
  const icons = await getIconsMappingCache();

  cache(CacheType.ICONS_MAPPING, icons);
}

export const cacheEncounterSets = async () => {
  console.log('caching Arkham Cards encounter sets...');
  const encounterSets = await getEncounterSetsCache();

  cache(CacheType.ENCOUNTER_SETS, encounterSets);
}