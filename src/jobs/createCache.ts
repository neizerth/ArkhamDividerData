import * as Data from '@/components/data';
import * as Database from '@/components/database'
;
import { CacheType } from '@/types/cache';
import { cache } from '@/util/cache';
import { delay } from '@/util/common';

export const createCache = async () => {
  console.log('starting cache creating...');

  console.log('caching entities...');
  await createEntityCache();
  await delay(200);

  console.log('caching database...');
  await createDatabaseCache();
  await delay(200);

  // console.log(CacheType.)

  // await cacheArkhamDB();
  // await cacheArkhamCards();
  
  // await cacheDatabase();

  // await cacheLanguages();
  // await cacheTranslations();
}

export const createDatabaseCache = () => {
  console.log('caching scenario campaigns sets...');
  cache(CacheType.SCENARIO_CAMPAIGNS, Data.getScenarioPacks());
  // console.log('caching scenario encounter sets...');
  // cache(CacheType.SCENARIO_ENCOUNTER_SETS, Data.getScenarioEncounterSets());

  return;
  console.log('caching database encounter sets...');
  cache(CacheType.DATABASE_ENCOUNTER_SETS, Database.getEncounterSets());

  console.log('caching database stories...');
  cache(CacheType.DATABASE_STORIES, Database.getStories());
}

export const createEntityCache = async () => {
  console.log('caching campaigns...');
  cache(CacheType.CAMPAIGNS, await Data.getCampaigns());
  
  await delay(200);
  console.log('caching standalone scenarios...');
  cache(CacheType.STANDALONE_SCENARIOS, await Data.getStandaloneScenarios());

  await delay(200);
  console.log('caching core languages...');
  cache(CacheType.CORE_LANGUAGES, await Data.getCoreLanguages());

  await delay(200);
  console.log('caching campaign languages...');
  cache(CacheType.CAMPAIGN_LANGUAGES, await Data.getCampaignLanguages());

  await delay(200);
  console.log('caching cycles...');
  cache(CacheType.CYCLES, await Data.getCycles());

  await delay(200);
  console.log('caching packs...');
  cache(CacheType.PACKS, await Data.getPacks());

  await delay(200);
  console.log('caching encounter sets...');
  cache(CacheType.ENCOUNTER_SETS, await Data.getEncounterSets());

  await delay(200);
  console.log('caching pack encounter sets...');
  cache(CacheType.PACK_ENCOUNTER_SETS, await Data.getPackEncounterSets());

  await delay(200);
  console.log('caching IcoMoon icons...');
  cache(CacheType.ICONS_PROJECT, await Data.getIcoMoonIcons());

  await delay(200);
  console.log('caching icons mapping...');
  cache(CacheType.ICONS_MAPPING, await Data.getIconsMapping());
}