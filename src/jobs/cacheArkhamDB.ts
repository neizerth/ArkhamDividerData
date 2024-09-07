import { cache } from "@/util/cache";
import { getCyclesCache } from "@/components";

export const cacheArkhamDB = async () => {
  console.log('cacheing ArkhamDB data');
  const { cycles, packs, encounterSets } = await getCyclesCache();

  cache('cycles', cycles);
  cache('packs', packs);
  cache('encounterSets', encounterSets);

}