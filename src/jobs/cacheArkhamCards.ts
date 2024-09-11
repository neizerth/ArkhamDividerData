import { cache } from "@/util/cache";
import { CacheType } from "@/types/cache";
import { getIconsMappingCache } from "@/components/icons/getIconsMappingCache";
import { getEncounterSetsCache } from "@/components/encounterSets/getEncounterSetsCache";
import { getCampaignsCache } from "@/components/campaigns/getCampaignsCache";
import { getIconsCache } from "@/components/icons/getIconsCache";
import { getCustomPacksCache } from "@/components/packs/getCustomPacksCache";
import { delay } from "@/util/common";
import { getCustomEncountersSetCache } from "@/components/encounterSets/getCustomEncounterSetsCache";

export const cacheArkhamCards = async () => {
  console.log('caching Arkham Cards...');
  
  await cacheIcons();
  await delay(200);

  await cacheIconMapping();
  await delay(200);
  
  await cacheCustomPacks();
  await delay(200);
  
  await cacheEncounterSets();
  await delay(200);

  await cacheCustomEncounterSets();
  await delay(200);

  await cacheCampaigns();
}

export const cacheIcons = async () => {
  console.log('caching Arkham Cards icons...');
  const project = await getIconsCache();

  cache(CacheType.ICONS_PROJECT, project);
}

export const cacheCustomPacks = async () => {
  console.log('caching Arkham Cards custom packs...');

  const packs = await getCustomPacksCache();
  cache(CacheType.CUSTOM_PACKS, packs);
}

export const cacheCustomEncounterSets = async () => {

  console.log('caching Arkham Cards custom encounter sets...');
  const customEncounterSets = await getCustomEncountersSetCache();
  cache(CacheType.CUSTOM_ENCOUNTER_SETS, customEncounterSets);
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