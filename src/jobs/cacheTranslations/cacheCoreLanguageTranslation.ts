import { loadJSONTranslationCycles, loadJSONTranslationEncounters, loadJSONTranslationPacks } from "@/api/arkhamDB/api";
import { IArkhamDB } from "@/types/arkhamDB";
import { CacheType } from "@/types/cache";
import { Mapping } from "@/types/common";
import * as Cache from "@/util/cache";
import { delay } from "@/util/common";
import { prop, propEq } from "ramda";

export const cacheCoreLanguageTranslation = async (language: string) => {
  await cacheEncounterSetTranslations(language);
  await delay(200);

  await cacheCampaignsTranslations(language);
  await delay(200);
}

export const cacheEncounterSetTranslations = async (language: string) => {
  console.log(`caching "${language}" encounter sets...`);
  const encounters = await loadJSONTranslationEncounters(language);
  const baseEncounters = Cache.getEncounterSets();

  const mapping = getCoreTranslationsMapping(baseEncounters, encounters);
  
  const cache = Cache.createI18NCacheWriter(language);

  cache(CacheType.ENCOUNTER_SETS, mapping);
}

export const cacheCampaignsTranslations = async (language: string) => {
  console.log(`caching "${language}" campaigns...`);
  console.log('loading cycles...');

  const cycles = await loadJSONTranslationCycles(language);
  const baseCycles = Cache.getCycles();
  const cyclesMapping = getCoreTranslationsMapping(baseCycles, cycles);

  await delay(200);

  console.log('loading packs...');

  const packs = await loadJSONTranslationPacks(language);
  const basePacks = Cache.getPacksFromCache();
  const packsMapping = getCoreTranslationsMapping(basePacks, packs);

  const mapping = {
    ...cyclesMapping,
    ...packsMapping
  }

  const campaigns = await Cache.getDatabaseCampaigns();
  
  const translatedCampaigns = campaigns
    .filter(({ name }) => {
      return name in mapping
    })
    .map(prop('id'));

  const cache = createI18NCacheWriter(language);

  cache(CacheType.CAMPAIGNS, mapping);
  cache(CacheType.TRANSLATED_CAMPAIGNS, translatedCampaigns);
}

type MappingItem = IArkhamDB.HasCode & IArkhamDB.HasName;

export const getCoreTranslationsMapping = (source: MappingItem[], translations: MappingItem[]): Mapping => 
  translations.reduce((target, { name, code }) => {
    const base = source.find(propEq(code, 'code'));
    if (!base) {
      return target;
    }
    if (base.name === name) {
      return target;
    }
    target[base.name] = name; 
    return target;
  }, 
  {} as Mapping
)