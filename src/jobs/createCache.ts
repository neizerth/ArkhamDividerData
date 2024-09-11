import * as Data from '@/components/data';
import { CacheType } from '@/types/cache';
import { cache } from '@/util/cache';

export const createCache = async () => {
  console.log('starting cache creating...');

  await createEntityCache();

  // console.log(CacheType.)

  // await cacheArkhamDB();
  // await cacheArkhamCards();
  
  await cacheDatabase();

  // await cacheLanguages();
  // await cacheTranslations();
}

export const createEntityCache = async () => {
  console.log('caching cycles...');
  cache(CacheType.CYCLES, await Data.getCycles());

  console.log('caching packs...');
  cache(CacheType.PACKS, await Data.getPacks());

  console.log('caching encounter sets...');
  cache(CacheType.ENCOUNTER_SETS, await Data.getEncounterSets());

  console.log('caching IcoMoon icons...');
  cache(CacheType.ICONS_PROJECT, await Data.getIcoMoonIcons());

  console.log('caching icons mapping...');
  cache(CacheType.ICONS_MAPPING, await Data.getIconsMapping());
}