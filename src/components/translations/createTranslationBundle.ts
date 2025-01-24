import type { Mapping } from "@/types/common";
import type { LanguageStoryTranslation, StoryTranslation } from "@/types/i18n";

export const createTranslationBundle = (sources: Mapping<LanguageStoryTranslation>[]) => {
  const translations: Mapping<{
    common: Mapping,
    translations: Mapping<Mapping>
    translated_by: Mapping<StoryTranslation['translated_by']>
  }> = {}

  const appendBundle = (source: Mapping<LanguageStoryTranslation>) => {
    for (const [lang, sideLangData] of Object.entries(source)) {
      if (!translations[lang]) {
        translations[lang] = {
          common: {},
          translations: {},
          translated_by: {}
        };
      }
      for (const [code, mapping] of Object.entries(sideLangData)) {
        Object.assign(translations[lang].common, mapping.common);
        translations[lang].translations[code] = mapping.translations;
        translations[lang].translated_by[code] = mapping.translated_by;
      }
    
    }
  }

  sources.forEach(appendBundle);
  
  return translations;
}

