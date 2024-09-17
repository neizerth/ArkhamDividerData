import { cache } from "@/util/cache";
import { CacheType } from "@/types/cache";
import { getIconsMapping } from "@/components/arkhamCards/icons/getIconsMapping";
import { getEncounterSetsCache } from "@/components/arkhamDB/encounterSets/getEncounterSetsCache";
import { getCampaignsCache } from "@/components/arkhamCards/campaigns.old/getCampaignsCache";
import { getIconsCache } from "@/components/arkhamCards/icons/getIconsCache";
import { delay } from "@/util/common";
import { getCustomEncountersSetCache } from "@/components/arkhamCards/encounterSets/getCustomEncounterSetsCache";
import { getCustomPacksCache } from "@/components/arkhamCards/packs/getCustomPacksCache";

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

  cache(CacheType.ICONS, project);
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
  const icons = await getIconsMapping();

  cache(CacheType.ICONS_MAPPING, icons);
}

export const cacheEncounterSets = async () => {
  console.log('caching Arkham Cards encounter sets...');
  const encounterSets = await getEncounterSetsCache();

  cache(CacheType.ENCOUNTER_SETS, encounterSets);
}