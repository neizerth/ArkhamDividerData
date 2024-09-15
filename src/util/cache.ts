import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { CacheType, ICache } from "@/types/cache";
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
export const getPacksFromCache = () => getCache<ICache.Pack[]>(CacheType.PACKS);
export const getEncountersFromCache = () => getCache<IArkhamDB.JSON.ExtendedEncounter[]>(CacheType.ENCOUNTERS);

// Arkham Cards
export const getCampaigns = () => getCache<IArkhamCards.JSON.FullCampaign[]>(CacheType.CAMPAIGNS);
export const getScenarios = () => getCache<IArkhamCards.Parsed.Scenario[]>(CacheType.SCENARIOS)
export const getIconMappingFromCache = () => getCache<Mapping>(CacheType.ICONS_MAPPING);
export const getCustomPacksFromCache = () => getCache<IArkhamCards.JSON.ExtendedPack[]>(CacheType.CUSTOM_PACKS);

export const getCampaignLanguages = () => getCache<string[]>(CacheType.CAMPAIGN_LANGUAGES);
export const getCoreLanguages = () => getCache<string[]>(CacheType.CORE_LANGUAGES);

export const getCustomEncountersSetFromCache = () => getCache<IArkhamCards.EncounterSet[]>(CacheType.CUSTOM_ENCOUNTER_SETS);
export const getEncountersSetsFromCache = () => getCache<IArkhamCards.EncounterSet[]>(CacheType.ENCOUNTER_SETS);

// database
// export const getDatabaseCampaigns = () => getCache<IDatabase.Campaign[]>(CacheType.DATABASE_CAMPAIGNS);

export const getCycles = () => getCache<ICache.Cycle[]>(CacheType.CYCLES);
export const getPacks = () => getCache<ICache.Pack[]>(CacheType.PACKS);
export const getEncounterSets = () => getCache<ICache.EncounterSet[]>(CacheType.ENCOUNTER_SETS);
export const getScenarioEncounterSets = () => getCache<ICache.ScenarioEncounterSet[]>(CacheType.SCENARIO_ENCOUNTER_SETS);
export const getPackEncounterSets = () => getCache<ICache.PackEncounterSet[]>(CacheType.PACK_ENCOUNTER_SETS);

export const getDatabaseEncounterSets = () => getCache<IDatabase.EncounterSet[]>(CacheType.DATABASE_ENCOUNTER_SETS);
export const getIconMapping = () => getCache<Mapping>(CacheType.ICONS_MAPPING);
export const getIconProject = () => getCache<IIcoMoon.Icon[]>(CacheType.ICONS_PROJECT);
export const getStandaloneScenarios = () => getCache<IArkhamCards.JSON.StandaloneScenario[]>(CacheType.STANDALONE_SCENARIOS);
export const getSideScenarios = () => getCache<ICache.SideScenario[]>(CacheType.SIDE_SCENARIOS);
export const getCampaignLinks = () => getCache<ICache.CampaignLink[]>(CacheType.CAMPAIGN_LINKS);

export const getStories = () => getCache<IDatabase.Story[]>(CacheType.DATABASE_STORIES);