import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { CacheType } from "@/types/cache";
import { Mapping } from "@/types/common";
import { IDatabase } from "@/types/database";

import { CACHE_DIR } from "@/config/app";
import { createJSONReader, createJSONWriter } from "./fs";
import { IIcoMoon } from "@/types/icomoon";

export const cache = createJSONWriter(CACHE_DIR);
export const getCache = createJSONReader(CACHE_DIR);

export const createI18NCacheWriter = (language: string) => createJSONWriter(CACHE_DIR + '/i18n/' + language);
export const createI18NCacheReader = (language: string) => createJSONReader(CACHE_DIR + '/i18n/' + language);
// ArkhamDB
export const getCyclesFromCache = () => getCache<IArkhamDB.JSON.ExtendedCycle[]>(CacheType.CYCLES);
export const getPacksFromCache = () => getCache<IArkhamDB.JSON.ExtendedPack[]>(CacheType.PACKS);
export const getEncountersFromCache = () => getCache<IArkhamDB.JSON.ExtendedEncounter[]>(CacheType.ENCOUNTERS);

// Arkham Cards
export const getCampaignsFromCache = () => getCache<IArkhamCards.Parsed.Campaign[]>(CacheType.CAMPAIGNS);
export const getScenariosFromCache = () => getCache<IArkhamCards.Parsed.Scenario[]>(CacheType.SCENARIOS)
export const getIconMappingFromCache = () => getCache<Mapping>(CacheType.ICONS_MAPPING);
export const getCustomPacksFromCache = () => getCache<IArkhamCards.JSON.ExtendedPack[]>(CacheType.CUSTOM_PACKS);

export const getCampaignLanguagesFromCache = () => getCache<string[]>(CacheType.CAMPAIGN_LANGUAGES);
export const getCoreLanguagesFromCache = () => getCache<string[]>(CacheType.CORE_LANGUAGES);

export const getCustomEncountersSetFromCache = () => getCache<IArkhamCards.EncounterSet[]>(CacheType.CUSTOM_ENCOUNTER_SETS);
export const getEncountersSetsFromCache = () => getCache<IArkhamCards.EncounterSet[]>(CacheType.ENCOUNTER_SETS);

// database
export const getDatabaseCampaignsFromCache = () => getCache<IDatabase.Campaign[]>(CacheType.DATABASE_CAMPAIGNS);
export const getDatabaseEncounterSetsFromCache = () => getCache<IDatabase.EncounterSet[]>(CacheType.DATABASE_ENCOUNTER_SETS);

export const getIconProjectFromCache = () => getCache<IIcoMoon.Icon[]>(CacheType.ICONS_PROJECT);