import { getCampaignsCache } from "@/components/arkhamCards/campaigns.old/getCampaignsCache";
import { createI18NCacheWriter, getCampaigns, getEncountersSetsFromCache, getScenariosFromCache } from "@/util/cache";
import { getCampaignMapping, getTranslatedCampaigns } from "./campaignTranslation";
import { getScenarioMapping } from "./getScenarioMapping";
import { CacheType } from "@/types/cache";
import { loadCoreTranslations, loadEncounterSets } from "@/api/arkhamCards/api";
import { getEncounterSetsMapping } from "@/components/arkhamDB/encounterSets/getEncounterSetsMapping";
import { translateMapping } from "./translateMapping";
import { Mapping } from "@/types/common";
import { delay } from "@/util/common";

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

  const baseCampaigns = getCampaigns();
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