import { delay } from "@/util/common";
import * as Cache from '@/util/cache';
import * as Translations from '@/components/translations'
import { CacheType } from "@/types/cache";
import { difference } from "ramda";

export const createTranslationsCache = async () => {
  console.log('caching translations...');
  
  await delay(200);
  console.log('caching story translations...');
  await createStoryTranslationsCache();

  await delay(200);
  console.log('caching encounter set translations...');
  await createEncounterSetTranslationsCache();

  await delay(200);
  console.log('caching core translations...');
  await createCommonTranslationsCache();
}

export const createEncounterSetTranslationsCache = async () => {
  const languages = Cache.getCampaignLanguages();
  for (const language of languages) {
    if (language === 'en') {
      continue;
    }
    await delay(200);
    const cache = Cache.createI18NCacheWriter(language);

    console.log(`caching "${language}" encounter set translations...`);
    const mapping = await Translations.getEncounterSetTranslatios(language);

    cache(CacheType.ENCOUNTER_SETS, mapping);
  }
}

export const createCommonTranslationsCache = async () => {
  const languages = Cache.getCampaignLanguages();

  for (const language of languages) {
    if (language === 'en') {
      continue;
    }
    await delay(200);
    const cache = Cache.createI18NCacheWriter(language);

    console.log(`caching "${language}" common translations...`);
    const mapping = await Translations.getCommonTranslations(language);

    cache(CacheType.COMMON_TRANSLATION, mapping);
  }
}

export const createStoryTranslationsCache = async () => {
  const campaignLanguages = Cache.getCampaignLanguages();
  for (const language of campaignLanguages) {
    if (language === 'en') {
      continue;
    }
    await delay(200);
    const cache = Cache.createI18NCacheWriter(language);

    console.log(`caching "${language}" campaign story translations...`);
    
    const { 
      campaigns, 
      scenarios, 
      translated 
    } = await Translations.getCampaignStoryTranslations(language);

    cache(CacheType.CAMPAIGNS, campaigns);
    cache(CacheType.SCENARIOS, scenarios);
    cache(CacheType.TRANSLATED_CAMPAIGNS, translated.campaigns);
    cache(CacheType.TRANSLATED_SCENARIOS, translated.scenarios);
  }
}