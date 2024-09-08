import { getLanguagesCache } from "@/components/cache/languages/getLanguagesCache";
import { CacheType } from "@/types/cache";
import { cache } from "@/util/cache";

export const cacheLanguages = async () => {
  const languages = await getLanguagesCache();
  
  cache(CacheType.LANGUAGES, languages);
}
