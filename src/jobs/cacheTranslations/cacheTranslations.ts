import { getCoreLanguagesFromCache } from "@/util/cache";
import { delay } from "@/util/common";
import { getCampaignLanguagesFromCache } from "@/util/cache";
import { cacheLanguageTranslation } from "./cacheLanguageTranslation";
import { cacheCoreLanguageTranslation } from "./cacheCoreLanguageTranslation";


export const cacheTranslations = async () => {
  // await cacheCampaignTranslations();
  await cacheCoreLanguageTranslations();
}

export const cacheCampaignTranslations = async () => {
  console.log('caching campaign translations...');
  const campaignLanguages = getCampaignLanguagesFromCache();
  for (const lang of campaignLanguages) {
    if (lang === 'en') {
      continue;
    }
    await delay(200);
    await cacheLanguageTranslation(lang);
  }
}

export const cacheCoreLanguageTranslations = async () => {
  console.log('caching core translations...');
  const campaignLanguages = getCampaignLanguagesFromCache();
  const coreLanguages = getCoreLanguagesFromCache();
  const languages = coreLanguages.filter(lang => !campaignLanguages.includes(lang));

  for (const lang of languages) {
    await delay(200);
    await cacheCoreLanguageTranslation(lang);
  }
}