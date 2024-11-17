import { Mapping } from "@/types/common";
import { LanguageStoryTranslation, StoryTranslation } from "@/types/i18n";

export const createTranslationBundle = (sources: Mapping<LanguageStoryTranslation>[]) => {
  const translations: Mapping<{
    common: Mapping,
    translations: Mapping<Mapping>
  }> = {}

  const appendBundle = (source: Mapping<LanguageStoryTranslation>) => {
    for (const [lang, sideLangData] of Object.entries(source)) {
      if (!translations[lang]) {
        translations[lang] = {
          common: {},
          translations: {}
        };
      }
      for (const [code, mapping] of Object.entries(sideLangData)) {
        Object.assign(translations[lang].common, mapping.common);
        translations[lang].translations[code] = mapping.translations;
      }
    
    }
  }

  sources.forEach(appendBundle);
  
  return translations;
}

