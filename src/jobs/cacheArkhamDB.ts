import { cache } from "@/util/cache";
import { getCyclesCache } from "@/components";
import { CacheType } from "@/types/cache";

export const cacheArkhamDB = async () => {
  console.log('caching ArkhamDB data...');
  const { cycles, packs, encounterSets } = await getCyclesCache();

  cache(CacheType.CYCLES, cycles);
  cache(CacheType.PACKS, packs);
  cache(CacheType.ENCOUNTERS, encounterSets);
}