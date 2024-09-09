import { getLanguagesCache } from "../components/cache/languages/getLanguagesCache";
import { CacheType } from "../types/cache";
import { cache } from "../util/cache";

export const cacheLanguages = async () => {
  console.log('caching languages...');
  const languages = await getLanguagesCache();
  
  cache(CacheType.LANGUAGES, languages);
}
