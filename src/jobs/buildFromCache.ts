import { IBuild } from "@/types/build";
import * as Cache from "../util/cache";
import { CacheType } from "@/types/cache";
import { buildSource } from "@/util/build";
import { createI18NCacheReader } from "@/util/cache";
import { Mapping } from "@/types/common";
import { prop } from "ramda";
import { getCustomContent } from "@/components/custom/getCustomContent";
import customTranslations from '@/data/translations';

export const buildFromCache = async () => {
  const languages = buildI18NSources();

  buildCoreSources(languages);
}

export const buildI18NSources = () => {
  console.log('building i18n...');
  const languages = Cache.getCampaignLanguages();

  return languages.filter(buildLanguageSource);
}

export const buildLanguageSource = (language: string) => {
  if (language === 'en') {
    return true;
  }

  console.log(`building language source: ${language}...`);
  const getCache = createI18NCacheReader(language);

  const translatedStoriesCache = getCache<string[]>(CacheType.TRANSLATED_STORIES);

  const custom = customTranslations[language];

  const customTranslatedStories = custom ? Object.keys(custom.translations) : [];

  const translatedStories = [
    ...translatedStoriesCache,
    ...customTranslatedStories
  ]

  if (translatedStories.length === 0) {
    return false;
  }

  const translatedCampaigns = getCache<string[]>(CacheType.TRANSLATED_CAMPAIGNS);
  const translatedScenarios = getCache<string[]>(CacheType.TRANSLATED_SCENARIOS);

  const campaigns = getCache<Mapping>(CacheType.CAMPAIGNS);
  const scenarios = getCache<Mapping>(CacheType.SCENARIOS);
  const common = getCache<Mapping>(CacheType.COMMON_TRANSLATION);
  const encounterSets = getCache<Mapping>(CacheType.ENCOUNTER_SETS);
  const investigators = getCache<Mapping>(CacheType.INVESTIGATORS);

  const storiesCache = getCache<Mapping>(CacheType.DATABASE_STORIES);
  const customStoriesTranslation = custom?.common || {};

  const stories = {
    ...storiesCache,
    ...customStoriesTranslation
  }

  const data: IBuild.Translation = {
    translatedCampaigns,
    translatedScenarios,
    translatedStories,
    campaigns,
    encounterSets,
    scenarios,
    stories,
    investigators,
    custom: custom?.translations || {},
    common
  }

  buildSource(language, data);
  return true;
}

export const buildCoreSources = (languages: string[]) => {
  console.log('building core sources...');
  const cachedStories = Cache.getStories();
  const cachedEncounterSets = Cache.getDatabaseEncounterSets();
  const icons = Cache.getIconInfo();
  
  const cachedPacks = Cache.getPacks();
  const cycles = Cache.getCycles();

  const uniqueCustomContent = getCustomContent()

  const customStories = uniqueCustomContent.map(prop('story'));
  const customEncounterSets = uniqueCustomContent
    .flatMap(prop('encounterSets'));
    
  const customPacks = uniqueCustomContent.map(prop('pack'));

  const stories = [
    ...cachedStories,
    ...customStories
  ];

  const encounterSets = [
    ...cachedEncounterSets,
    ...customEncounterSets
  ];

  const packs = [
    ...cachedPacks,
    ...customPacks
  ]

  const data: IBuild.Core = {
    languages,
    stories,
    encounterSets,
    packs,
    cycles,
    icons,
  };

  buildSource(CacheType.CORE, data);
}