import * as Cache from '@/util/cache';
import * as Translations from '@/components/translations'
import { CacheType } from '@/types/cache';
import { Mapping } from '@/types/common';
import { toTranslationBundle } from './toTranslationBundle';
import { fromPairs, isNotNil, toPairs } from 'ramda';
import { onlyWords } from '@/util/common';
import { showWarning } from '@/util/console';

export const createStoryTranslationsCache = async () => {
  const campaignLanguages = Cache.getCampaignLanguages();
  for (const language of campaignLanguages) {
    if (language === 'en') {
      continue;
    }
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
    
    cache(CacheType.CAMPAIGNS, toTranslationBundle(campaigns));
    cache(CacheType.SCENARIOS, toTranslationBundle(scenarios));
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