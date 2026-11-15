import type { Mapping } from "@/types/common";
import type { LanguageStoryTranslation, StoryTranslation } from "@/types/i18n";

export type TranslationBundle = Mapping<{
	common: Mapping;
	translations: Mapping<Mapping>;
	translated_by: Mapping<StoryTranslation["translated_by"]>;
	download_links: Mapping<StoryTranslation["download_links"]>;
}>;

export const createTranslationBundle = (
	sources: Mapping<LanguageStoryTranslation>[],
): TranslationBundle => {
	const translations: TranslationBundle = {};

	const appendBundle = (source: Mapping<LanguageStoryTranslation>) => {
		for (const [lang, sideLangData] of Object.entries(source)) {
			if (!translations[lang]) {
				translations[lang] = {
					common: {},
					translations: {},
					translated_by: {},
					download_links: {},
				};
			}
			for (const [code, mapping] of Object.entries(sideLangData)) {
				Object.assign(translations[lang].common, mapping.common);
				translations[lang].translations[code] = mapping.translations;
				translations[lang].translated_by[code] = mapping.translated_by;
				if (mapping.download_links?.length) {
					translations[lang].download_links[code] = mapping.download_links;
				}
			}
		}
	};

	sources.forEach(appendBundle);

	return translations;
};
