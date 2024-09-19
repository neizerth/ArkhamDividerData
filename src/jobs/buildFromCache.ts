import { IBuild } from "@/types/build";
import * as Cache from "../util/cache";
import { CacheType } from "@/types/cache";
import { buildSource } from "@/util/build";
import { createI18NCacheReader } from "@/util/cache";
import { Mapping } from "@/types/common";

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


  const translatedStories = getCache<string[]>(CacheType.TRANSLATED_STORIES);

  if (translatedStories.length === 0) {
    return false;
  }

  const translatedCampaigns = getCache<string[]>(CacheType.TRANSLATED_CAMPAIGNS);
  const translatedScenarios = getCache<string[]>(CacheType.TRANSLATED_SCENARIOS);

  const campaigns = getCache<Mapping>(CacheType.CAMPAIGNS);
  const scenarios = getCache<Mapping>(CacheType.SCENARIOS);
  const common = getCache<Mapping>(CacheType.COMMON_TRANSLATION);
  const encounterSets = getCache<Mapping>(CacheType.ENCOUNTER_SETS);

  const stories = getCache<Mapping>(CacheType.DATABASE_STORIES);
  
  const data: IBuild.Translation = {
    translatedCampaigns,
    translatedScenarios,
    translatedStories,
    campaigns,
    encounterSets,
    scenarios,
    stories,
    common
  }

  buildSource(language, data);
  return true;
}

export const buildCoreSources = (languages: string[]) => {
  console.log('building core sources...');
  const stories = Cache.getStories();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const icons = Cache.getIconInfo();
  
  const packs= Cache.getPacks();
  const cycles = Cache.getCycles();

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