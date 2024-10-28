import * as C from "@/config/api";
import * as R from "@/api/request";
import * as F from "@/api/fileRepo";
import { IArkhamDB } from "@/types/arkhamDB";

const getAPIData = R.getWithPrefix(C.ARKHAMDB_API_BASE_URL);
const getPageContents = R.getWithPrefix(C.ARKHAMDB_BASE_URL);

const getGithubJSON = F.getWithPrefix(C.ARKHAMDB_DATA_FOLDER_NAME);
const getGithubContents = F.getContents(C.ARKHAMDB_DATA_FOLDER_NAME);

export const loadPacks = async () => {
  const { data } = await getAPIData('/packs');
  return data as IArkhamDB.API.Pack[];
}

export const loadLocalPackCards = async (cycleCode: string, code: string, language: string) => {
  const url = `translations/${language}/pack/${cycleCode}/${code}.json`;
  const { data } = await getGithubJSON<IArkhamDB.API.Card[]>(url, {
    defaultData: []
  });
  return data;
}

export const loadSearchPageContents = async () => {
  const { data } = await getPageContents('/search');
  return data;
}

export const loadJSONCycles = async () => {
  const { data } = await getGithubJSON<IArkhamDB.JSON.Cycle[]>('/cycles.json');
  return data;
}

export const loadJSONPacks = async () => {
  const { data } = await getGithubJSON<IArkhamDB.JSON.Pack[]>('/packs.json');
  return data;
}

export const loadJSONEncounters = async () => {
  const { data } = await getGithubJSON<IArkhamDB.JSON.Encounter[]>('/encounters.json');
  return data;
}

export const loadJSONTranslationEncounters = async (language: string) => {
  const { data } = await getGithubJSON<IArkhamDB.JSON.Encounter[]>(`translations/${language}/encounters.json`);
  return data;
}

export const loadJSONTranslationPacks = async (language: string) => {
  const { data } = await getGithubJSON<IArkhamDB.JSON.Pack[]>(`translations/${language}/packs.json`);
  return data;
}

export const loadJSONTranslationCycles = async (language: string) => {
  const { data } = await getGithubJSON<IArkhamDB.JSON.Cycle[]>(`translations/${language}/cycles.json`);
  return data;
}

export const loadJSONPackEncounterCards = async (cycleCode: string, code: string) => {
  const cycle = cycleCode === 'side_stories' ? 'side' : cycleCode;
  const { data } = await getGithubJSON<IArkhamDB.JSON.EncounterCard[]>(`/pack/${cycle}/${code}_encounter.json`, {
    defaultData: []
  });
  return data
}

export const loadJSONPackCards = async (cycleCode: string, code: string) => {
  const cycle = cycleCode === 'side_stories' ? 'side' : cycleCode;
  const { data } = await getGithubJSON<IArkhamDB.JSON.Card[]>(`/pack/${cycle}/${code}.json`, {
    defaultData: []
  });
  return data
}

export const loadFolderContents = async (path: string) => {
  const { data } = await getGithubContents(path);
  return data;
}

export const loadTranslationLanguages = async () => {
  const languages = await loadFolderContents('/translations');

  return [
    'en',
    ...languages
  ];
}