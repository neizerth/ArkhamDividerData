import { delay } from "@/util/common";
import * as Cache from '@/util/cache';
import * as Translations from '@/components/translations'
import { CacheType } from "@/types/cache";
import { toTranslationBundle } from "./translations/toTranslationBundle";
import { createStoryTranslationsCache } from "./translations/createStoryTranslationsCache";

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

  await delay(200);
  console.log('caching investigator translations...');
  await createInvestigatorTranslationsCache();
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

    cache(CacheType.COMMON_TRANSLATION, toTranslationBundle(mapping));
  }
}

export const createInvestigatorTranslationsCache = async () => {
  const languages = Cache.getCampaignLanguages();

  for (const language of languages) {
    if (language === 'en') {
      continue;
    }
    await delay(200);
    const cache = Cache.createI18NCacheWriter(language);

    console.log(`caching "${language}" investigators...`);
    const mapping = await Translations.getInvestigatorTranslations(language);

    cache(CacheType.INVESTIGATORS, mapping);
  }
}
