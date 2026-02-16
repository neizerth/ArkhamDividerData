import { createTranslationBundle } from "@/components/translations/createTranslationBundle";
import type { Mapping, SingleValue } from "@/types/common";
import type { LanguageStoryTranslation } from "@/types/i18n";
import * as campaigns from "./campaigns";
import * as side from "./side";

const sources = [
	campaigns,
	side,
] as unknown as Mapping<LanguageStoryTranslation>[];

type TranslationSource = SingleValue<typeof sources>;

const translations = createTranslationBundle(sources);

export const getDataTranslationCodes = (language: string) => {
	const byLang = (s: TranslationSource) => Object.keys(s[language] ?? {});

	const [campaigns, side] = sources;

	const campaignCodes = byLang(campaigns);
	const scenarioCodes = byLang(side);
	const storyCodes = [...campaignCodes, ...scenarioCodes];

	return {
		campaignCodes,
		scenarioCodes,
		storyCodes,
	};
};

export default translations;
