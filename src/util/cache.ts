import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { CacheType } from "@/types/cache";
import { Mapping } from "@/types/common";
import { IDatabase } from "@/types/database";

import { CACHE_DIR } from "@/config/app";
import { createJSONReader, createJSONWriter } from "./fs";

export const cache = createJSONWriter(CACHE_DIR);
export const getCache = createJSONReader(CACHE_DIR);

export const createI18NCacheWriter = (language: string) => createJSONWriter(CACHE_DIR + '/i18n/' + language);
export const createI18NCacheReader = (language: string) => createJSONReader(CACHE_DIR + '/i18n/' + language);

export const getCyclesFromCache = () => getCache<IArkhamDB.JSON.ExtendedCycle[]>(CacheType.CYCLES);
export const getPacksFromCache = () => getCache<IArkhamDB.JSON.ExtendedPack[]>(CacheType.PACKS);
export const getEncountersFromCache = () => getCache<IArkhamDB.JSON.ExtendedEncounter[]>(CacheType.ENCOUNTERS);
export const getEncountersSetsFromCache = () => getCache<Mapping>(CacheType.ENCOUNTER_SETS);

export const getCampaignsFromCache = () => getCache<IArkhamCards.Parsed.Campaign[]>(CacheType.CAMPAIGNS);
export const getScenariosFromCache = () => getCache<IArkhamCards.Parsed.Scenario[]>(CacheType.SCENARIOS)
export const getIconMappingFromCache = () => getCache<Mapping>(CacheType.ICONS_MAPPING);

export const getAvailableLanguagesFromCache = () => getCache<string[]>(CacheType.LANGUAGES);

export const getDatabaseCampaignsFromCache = () => getCache<IDatabase.Campaign[]>(CacheType.DATABASE_CAMPAIGNS);
export const getDatabaseEncounterSetsFromCache = () => getCache<IDatabase.EncounterSet[]>(CacheType.DATABASE_ENCOUNTER_SETS);

export const getIconsFromCache = () => getCache<string[]>(CacheType.ICONS);