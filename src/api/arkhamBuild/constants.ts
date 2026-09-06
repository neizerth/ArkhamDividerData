/** Languages supported by https://api.arkham.build/v1/cache/cards/{lang} */
export const ARKHAM_BUILD_LANGUAGES = [
	"en",
	"ru",
	"de",
	"fr",
	"es",
	"it",
	"pl",
	"zh",
	"ko",
	"pt",
] as const;

export type ArkhamBuildLanguage = (typeof ARKHAM_BUILD_LANGUAGES)[number];

/**
 * Map project language codes onto arkham.build cache codes.
 * Unsupported languages resolve to `null`.
 */
export const ARKHAM_BUILD_LANGUAGE_MAP: Record<string, ArkhamBuildLanguage | null> = {
	en: "en",
	ru: "ru",
	de: "de",
	fr: "fr",
	es: "es",
	it: "it",
	pl: "pl",
	zh: "zh",
	"zh-cn": "zh",
	zh_cn: "zh",
	ko: "ko",
	pt: "pt",
	cs: null,
	vi: null,
	vn: null,
	uk: null,
};

export const resolveArkhamBuildLanguage = (
	language: string,
): ArkhamBuildLanguage | null => {
	if (language in ARKHAM_BUILD_LANGUAGE_MAP) {
		return ARKHAM_BUILD_LANGUAGE_MAP[language];
	}
	if ((ARKHAM_BUILD_LANGUAGES as readonly string[]).includes(language)) {
		return language as ArkhamBuildLanguage;
	}
	return null;
};
