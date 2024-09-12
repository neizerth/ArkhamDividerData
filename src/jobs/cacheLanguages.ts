import { getCampaignLanguages, getCoreLanguages } from "@/components/data";
import { CacheType } from "@/types/cache";
import { cache } from "@/util/cache";

export const cacheLanguages = async () => {
  console.log('caching languages...');
  const campaignLanguages = await getCampaignLanguages();
  const coreLanguages = await getCoreLanguages();
  
  cache(CacheType.CORE_LANGUAGES, coreLanguages);
  cache(CacheType.CAMPAIGN_LANGUAGES, campaignLanguages);
}
