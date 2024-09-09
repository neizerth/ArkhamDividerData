import { cache } from "@/util/cache";
import { CacheType } from "@/types/cache";
import { getIconsMappingCache } from "@/components/icons/getIconsMappingCache";
import { getEncounterSetsCache } from "@/components/encounterSets/getEncounterSetsCache";
import { getCampaignsCache } from "@/components/campaigns/getCampaignsCache";
import { getIconsCache } from "@/components/icons/getIconsCache";

export const cacheArkhamCards = async () => {
  console.log('caching Arkham Cards...');
  await cacheIcons();
  await cacheIconMapping();
  
  await cacheCampaigns();
  await cacheEncounterSets();
}

export const cacheIcons = async () => {
  console.log('caching Arkham Cards icons...');
  const icons = await getIconsCache();

  cache(CacheType.ICONS, icons);
}

export const cacheCampaigns = async () => {
  console.log('caching Arkham Cards campaigns...');
  const { campaigns, scenarios } = await getCampaignsCache();

  cache(CacheType.CAMPAIGNS, campaigns);
  cache(CacheType.SCENARIOS, scenarios);
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