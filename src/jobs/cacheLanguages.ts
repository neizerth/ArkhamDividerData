import { getCampaignLanguagesCache } from "@/components/languages/getCampaignLanguagesCache";
import { getCoreLanguagesCache } from "@/components/languages/getCoreLanguagesCache";
import { CacheType } from "@/types/cache";
import { cache } from "@/util/cache";

export const cacheLanguages = async () => {
  console.log('caching languages...');
  const campaignLanguages = await getCampaignLanguagesCache();
  const coreLanguages = await getCoreLanguagesCache();
  
  cache(CacheType.CORE_LANGUAGES, coreLanguages);
  cache(CacheType.CAMPAIGN_LANGUAGES, campaignLanguages);
}
