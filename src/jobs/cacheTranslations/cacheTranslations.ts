import { loadCoreTranslations, loadEncounterSets } from "@/api/arkhamCards/api";
import { CacheType } from "@/types/cache";
import { Mapping } from "@/types/common";
import { createI18NCacheWriter } from "@/util/cache";
import { delay } from "@/util/common";
import { getCampaignMapping } from "./getCampaignsMapping";
import { getScenarioMapping } from "./getScenarioMapping";
import { getAvailableLanguagesFromCache, getCampaignsFromCache, getScenariosFromCache } from "@/components/cache";
import { getCampaignsCache } from "@/components/cache/campaigns/getCampaignsCache";

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

  const cache = createI18NCacheWriter(language);

  cache(CacheType.CAMPAIGNS, campaignsMapping);
  cache(CacheType.SCENARIOS, scenariosMapping);
}

export const cacheEncounterSetTranslation = async (language: string) => {
  console.log(`caching "${language}" encounter sets...`);
  const encounterSets = await loadEncounterSets(language);

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