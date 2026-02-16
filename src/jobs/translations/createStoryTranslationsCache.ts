import * as Translations from "@/components/translations";
import { getDataTranslationCodes } from "@/data/translations";
import { CacheType } from "@/types/cache";
import type { Mapping } from "@/types/common";
import * as Cache from "@/util/cache";
import { onlyWords } from "@/util/common";
import { showWarning } from "@/util/console";
import { fromPairs, isNotNil, toPairs, uniq } from "ramda";
import { toTranslationBundle } from "./toTranslationBundle";

export const createStoryTranslationsCache = async () => {
	const campaignLanguages = Cache.getCampaignLanguages();
	for (const language of campaignLanguages) {
		if (language === "en") {
			continue;
		}
		const cache = Cache.createI18NCacheWriter(language);
		const getCache = Cache.createI18NCacheReader(language);

		console.log(`caching "${language}" campaign story translations...`);

		const { campaigns, scenarios, translated } =
			await Translations.getCampaignStoryTranslations(language);

		const common = getCache<Mapping>(CacheType.COMMON_TRANSLATION);
		const encounters = getCache<Mapping>(CacheType.ENCOUNTER_SETS);

		const mapping = {
			...common,
			...encounters,
			...campaigns,
			...scenarios,
		};

		const stories = getStoriesTranslation(mapping);

		const {
			campaignCodes: dataCampaignCodes,
			scenarioCodes: dataScenarioCodes,
			storyCodes: dataStoryCodes,
		} = getDataTranslationCodes(language);

		const translatedStories = uniq([...stories.translated, ...dataStoryCodes]);

		const translatedCampaigns = uniq([
			...translated.campaigns,
			...dataCampaignCodes,
		]);
		const translatedScenarios = uniq([
			...translated.scenarios,
			...dataScenarioCodes,
		]);

		cache(CacheType.DATABASE_STORIES, stories.translation);
		cache(CacheType.TRANSLATED_STORIES, translatedStories);

		cache(CacheType.CAMPAIGNS, toTranslationBundle(campaigns));
		cache(CacheType.SCENARIOS, toTranslationBundle(scenarios));
		cache(CacheType.TRANSLATED_CAMPAIGNS, translatedCampaigns);
		cache(CacheType.TRANSLATED_SCENARIOS, translatedScenarios);
	}
};

export const getStoriesTranslation = (mapping: Mapping) => {
	const stories = Cache.getStories();
	const pairs = toPairs(mapping);
	const translated: string[] = [];

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

			return [name, pair[1]];
		})
		.filter(isNotNil) as [string, string][];

	return {
		translation: fromPairs(translatedPairs),
		translated,
	};
};
