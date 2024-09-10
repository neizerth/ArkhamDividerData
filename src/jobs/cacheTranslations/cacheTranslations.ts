import { CacheType } from "@/types/cache";
import { Mapping } from "@/types/common";

import { loadCoreTranslations, loadEncounterSets } from "@/api/arkhamCards/api";
import { createI18NCacheWriter, getEncountersSetsFromCache } from "@/util/cache";
import { delay } from "@/util/common";
import { getAvailableLanguagesFromCache, getCampaignsFromCache, getScenariosFromCache } from "@/util/cache";
import { getCampaignsCache } from "@/components/campaigns/getCampaignsCache";

import { getCampaignMapping, getTranslatedCampaigns } from "./campaignTranslation";
import { getScenarioMapping } from "./getScenarioMapping";
import { translateMapping } from "./translateMapping";
import { getEncounterSetsMapping } from "@/components/encounterSets/getEncounterSetsMapping";

export const cacheTranslations = async () => {
  const languages = getAvailableLanguagesFromCache();

  for (const lang of languages) {
    if (lang === 'en') {
      continue;
    }
    await delay(200);
    await cacheLanguageTranslation(lang);
  }
  // console.log(languages);
}

export const cacheLanguageTranslation = async (language: string) => {
  console.log(`caching "${language}" translation...`);
  await cacheCommonTranslation(language);
  await delay(200);

  await cacheEncounterSetTranslation(language);
  await delay(200);

  await cacheCampaignTranslation(language);
  await delay(200);
}

export const cacheCampaignTranslation = async (language: string) => {
  console.log(`caching "${language}" campaign...`);

  const baseCampaigns = getCampaignsFromCache();
  const baseScenarios = getScenariosFromCache();

  const { campaigns, scenarios } = await getCampaignsCache(language);

  const campaignsMapping = getCampaignMapping(baseCampaigns, campaigns);
  const scenariosMapping = getScenarioMapping(baseScenarios, scenarios);

  const translatedCampaigns = getTranslatedCampaigns(baseCampaigns, campaigns);

  const cache = createI18NCacheWriter(language);

  cache(CacheType.TRANSLATED_CAMPAIGNS, translatedCampaigns);
  cache(CacheType.CAMPAIGNS, campaignsMapping);
  cache(CacheType.SCENARIOS, scenariosMapping);
}

export const cacheEncounterSetTranslation = async (language: string) => {
  console.log(`caching "${language}" encounter sets...`);
  const mapping = await loadEncounterSets(language);
  const baseEncounters = getEncountersSetsFromCache();
  const baseMapping = getEncounterSetsMapping(baseEncounters);
  
  const encounterSets = translateMapping(baseMapping, mapping);

  const cache = createI18NCacheWriter(language);
  cache(CacheType.ENCOUNTER_SETS, encounterSets);
}

export const cacheCommonTranslation = async (language: string) => {
  console.log(`caching "${language}" common translation...`);
  const source = await loadCoreTranslations(language);
  const mapping: Mapping = Object.values(source.translations[''])
    .reduce((target, { msgid, msgstr }) => {
      if (!msgid) {
        return target;
      }
      const [value] = msgstr;
      target[msgid] = value || msgid;
      return target;
    }, {} as Mapping)

  const cache = createI18NCacheWriter(language);
  cache(CacheType.COMMON_TRANSLATION, mapping);
}