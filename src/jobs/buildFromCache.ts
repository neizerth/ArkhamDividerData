import { getAvailableLanguagesFromCache, getCyclesFromCache, getDatabaseCampaignsFromCache, getDatabaseEncounterSetsFromCache, getPacksFromCache, getScenariosFromCache } from "../util/cache";
import { CacheType } from "@/types/cache";
import { buildSource } from "@/util/build";
import { createI18NCacheReader } from "@/util/cache";

export const buildFromCache = async () => {
  buildCoreSources();
  buildI18NSources();
}

export const buildI18NSources = () => {
  console.log('building i18n...');
  const languages = getAvailableLanguagesFromCache();

  languages.forEach(buildLanguageSource);
}

export const buildLanguageSource = (language: string) => {
  console.log(`building language source: ${language}...`);
  const getCache = createI18NCacheReader(language);

  const campaigns = getCache(CacheType.CAMPAIGNS);
  const common = getCache(CacheType.COMMON_TRANSLATION);
  const encounterSets = getCache(CacheType.ENCOUNTER_SETS);
  const scenarios = getCache(CacheType.SCENARIOS);
  
  const data = {
    campaigns,
    encounterSets,
    scenarios,
    common
  }

  buildSource(language, data);
}

export const buildCoreSources = () => {
  console.log('building core sources...');
  const languages = getAvailableLanguagesFromCache();
  const campaigns = getDatabaseCampaignsFromCache();
  const encounterSet = getDatabaseEncounterSetsFromCache();
  const scenarios = getScenariosFromCache();
  const packs = getPacksFromCache();
  const cycles = getCyclesFromCache();

  const data = {
    languages,
    campaigns,
    encounterSet,
    scenarios,
    packs,
    cycles
  };

  buildSource(CacheType.CORE, data);
}