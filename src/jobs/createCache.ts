import * as Data from '@/components/data';
import * as Database from '@/components/database'
import * as Validation from '@/components/validation'
;
import { CacheType } from '@/types/cache';
import { cache } from '@/util/cache';

import { createTranslationsCache } from './createTranslationsCache';

export const createCache = async () => {
  console.log('starting cache creating...');

  console.log('caching entities...');
  await createEntityCache();

  console.log('caching icons...');
  await createIconsCache();

  console.log('caching database...');
  await createDatabaseCache();

  console.log('caching translations...');
  await createTranslationsCache();
}


export const createDatabaseCache = async () => {

  console.log('caching campaign links...');
  cache(CacheType.CAMPAIGN_LINKS, Data.getCampaignLinks());

  console.log('caching scenario encounter sets...');
  cache(CacheType.SCENARIO_ENCOUNTER_SETS, Data.getScenarioEncounterSets());

  console.log('caching database encounter sets...');
  cache(CacheType.DATABASE_ENCOUNTER_SETS, Database.getEncounterSets());

  console.log('caching side scenarios...');
  cache(CacheType.SIDE_SCENARIOS, Data.getSideScenarios());

  console.log('caching database stories...');
  cache(CacheType.DATABASE_STORIES, Database.getStories());

  Validation.checkStories();
}

export const createIconsCache = async () => {
  console.log('caching IcoMoon icons...');
  cache(CacheType.ICONS, await Data.getIcoMoonIcons());

  console.log('caching icons mapping...');
  cache(CacheType.ICONS_MAPPING, await Data.getIconsMapping());

  console.log('caching icons last glyph map...');
  cache(CacheType.ICONS_LAST_GLYPH_MAP, await Data.getLastGlyphMap());
}

export const createEntityCache = async () => {
  console.log('caching campaigns...');
  cache(CacheType.CAMPAIGNS, await Data.getCampaigns());
  
  console.log('caching standalone scenarios...');
  cache(CacheType.STANDALONE_SCENARIOS, await Data.getStandaloneScenarios());

  console.log('caching core languages...');
  cache(CacheType.CORE_LANGUAGES, await Data.getCoreLanguages());

  console.log('caching campaign languages...');
  cache(CacheType.CAMPAIGN_LANGUAGES, await Data.getCampaignLanguages());

  console.log('caching cycles...');
  cache(CacheType.CYCLES, await Data.getCycles());

  console.log('caching packs...');
  cache(CacheType.PACKS, await Data.getPacks());

  console.log('caching encounter sets...');
  cache(CacheType.ENCOUNTER_SETS, await Data.getEncounterSets());

  console.log('caching pack encounter sets...');
  cache(CacheType.PACK_ENCOUNTER_SETS, await Data.getPackEncounterSets());

  console.log('caching pack investigators sets...');
  cache(CacheType.PACK_INVESTIGATORS, await Data.getPackInvestigators());
}