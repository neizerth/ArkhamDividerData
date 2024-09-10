import { IBuild } from "@/types/build";
import { getCoreLanguagesFromCache, getCustomPacksFromCache, getCyclesFromCache, getDatabaseCampaignsFromCache, getDatabaseEncounterSetsFromCache, getPacksFromCache, getScenariosFromCache } from "../util/cache";
import { CacheType } from "@/types/cache";
import { buildSource } from "@/util/build";
import { createI18NCacheReader } from "@/util/cache";
import { IDatabase } from "@/types/database";
import { Mapping } from "@/types/common";

export const buildFromCache = async () => {

  const availableLanguages = buildI18NSources();

  buildCoreSources(availableLanguages);
}

export const buildI18NSources = () => {
  console.log('building i18n...');
  const languages = getCoreLanguagesFromCache();

  return languages.filter(buildLanguageSource);
}

export const buildLanguageSource = (language: string) => {
  console.log(`building language source: ${language}...`);
  const getCache = createI18NCacheReader(language);

  const translatedCampaigns = getCache<string[]>(CacheType.TRANSLATED_CAMPAIGNS);

  if (translatedCampaigns.length === 0) {
    return false;
  }

  const campaigns = getCache<Mapping>(CacheType.CAMPAIGNS);
  const common = getCache<Mapping>(CacheType.COMMON_TRANSLATION);
  const encounterSets = getCache<Mapping>(CacheType.ENCOUNTER_SETS);
  const scenarios = getCache<Mapping>(CacheType.SCENARIOS);
  
  const data: IBuild.Translation = {
    translatedCampaigns,
    campaigns,
    encounterSets,
    scenarios,
    common
  }

  buildSource(language, data);
  return true;
}

export const buildCoreSources = (languages: string[]) => {
  console.log('building core sources...');
  const campaigns = getDatabaseCampaignsFromCache();
  const encounterSets = getDatabaseEncounterSetsFromCache();
  const scenarios = getScenariosFromCache();
  
  const packs: IDatabase.Pack[] = [
    ...getPacksFromCache(),
    ...getCustomPacksFromCache()
  ]

  const cycles = getCyclesFromCache();

  const data: IBuild.Core = {
    languages,
    campaigns,
    encounterSets,
    scenarios,
    packs,
    cycles
  };

  buildSource(CacheType.CORE, data);
}