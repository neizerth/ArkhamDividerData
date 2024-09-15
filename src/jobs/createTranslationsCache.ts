import { delay } from "@/util/common";

export const createTranslationsCache = async () => {
  console.log('caching translations...');
  
  await delay(200);

  await createStoryTranslationsCache();
}

export const createStoryTranslationsCache = async () => {
  for (const language of languages) {
    if (language === 'en') {
      continue;
    }
    await delay(200);
    await Translations.getStoryTranslations(language);
  }
}