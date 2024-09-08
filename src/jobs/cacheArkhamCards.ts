import { cache } from "@/util/cache";
import { CacheType } from "@/types/cache";
import { getIconsMappingCache } from "@/components/cache/icons/getIconsMappingCache";
import { getEncounterSetsCache } from "@/components/cache/encounterSets/getEncounterSetsCache";
import { getCampaignsCache } from "@/components/cache/campaigns/getCampaignsCache";

export const cacheArkhamCards = async () => {
  console.log('caching Arkham Cards...');
  await cacheCampaigns();
  await cacheEncounterSets();
  await cacheIconMapping();
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