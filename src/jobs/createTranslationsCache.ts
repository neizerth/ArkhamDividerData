import { delay, onlyWords } from "@/util/common";
import * as Cache from '@/util/cache';
import * as Translations from '@/components/translations'
import { CacheType } from "@/types/cache";
import { Mapping } from "@/types/common";
import { fromPairs, isNotNil, toPairs } from "ramda";
import { showWarning } from "@/util/console";

export const createTranslationsCache = async () => {
  console.log('caching translations...');

  await delay(200);
  console.log('caching core translations...');
  await createCommonTranslationsCache();

  await delay(200);
  console.log('caching encounter set translations...');
  await createEncounterSetTranslationsCache();
  
  await delay(200);
  console.log('caching story translations...');
  await createStoryTranslationsCache();
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
    const getCache = Cache.createI18NCacheReader(language);

    console.log(`caching "${language}" campaign story translations...`);
    
    const { 
      campaigns, 
      scenarios, 
      translated 
    } = await Translations.getCampaignStoryTranslations(language);

    const common = getCache<Mapping>(CacheType.COMMON_TRANSLATION);
    const encounters = getCache<Mapping>(CacheType.ENCOUNTER_SETS);

    const mapping = {
      ...common,
      ...encounters,
      ...campaigns,
      ...scenarios
    };

    const stories = getStoriesTranslation(mapping);

    cache(CacheType.DATABASE_STORIES, stories.translation);
    cache(CacheType.TRANSLATED_STORIES, stories.translated);
    
    cache(CacheType.CAMPAIGNS, campaigns);
    cache(CacheType.SCENARIOS, scenarios);
    cache(CacheType.TRANSLATED_CAMPAIGNS, translated.campaigns);
    cache(CacheType.TRANSLATED_SCENARIOS, translated.scenarios);
  }
}

export const getStoriesTranslation = (mapping: Mapping) => {
  const stories = Cache.getStories();
  const pairs = toPairs(mapping);
  const translated: string[] = []

  const translatedPairs = stories
    .map(({ code, name }) => {
      if (mapping[name] === name) {
        return;
      }
      if (mapping[name]) {
        translated.push(code);
        return;
      }
      const from = onlyWords(name).toLowerCase();
      const pair = pairs.find(([key]) => onlyWords(key).toLowerCase() === from);
      
      if (!pair) {
        showWarning(`translation ${name} not found!`);
        return;
      }

      translated.push(code);

      return [
        name,
        pair[1]
      ]
    })
   .filter(isNotNil) as [string, string][];

  return {
    translation: fromPairs(translatedPairs),
    translated
  };
}
