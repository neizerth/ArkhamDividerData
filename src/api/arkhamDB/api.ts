import { ARKHAMDB_BASE_URL, ARKHAMDB_API_BASE_URL, ARKHAMDB_JSON_BASE_URL, ARKHAMDB_CONTENTS_BASE_URL } from "../../config/api";
import { getWithPrefix } from "../request";
import { IArkhamDB } from "../../types/arkhamDB";
import { IGithub } from "../../types/github";
import { prop } from "ramda";

const getAPIData = getWithPrefix(ARKHAMDB_API_BASE_URL);
const getPageContents = getWithPrefix(ARKHAMDB_BASE_URL);
const getGithubJSON = getWithPrefix(ARKHAMDB_JSON_BASE_URL);
const getGithubContents = getWithPrefix(ARKHAMDB_CONTENTS_BASE_URL);

export const loadPacks = async () => {
  const { data } = await getAPIData('/packs');
  return data as IArkhamDB.API.Pack[];
}

export const loadAllCards = async (encounters: boolean) => {
  const qs = encounters ? 'encounter=true' : '';

  const { data } = await getAPIData(`/cards?${qs}`);
  return data as IArkhamDB.API.Card[];
}

export const loadPackCards = async ({ code }: IArkhamDB.HasCode) => {
  const { data } = await getAPIData(`/cards/${code}`);
  return data as IArkhamDB.API.Card[];
}

export const loadSearchPageContents = async () => {
  const { data } = await getPageContents('/search');
  return data;
}

export const loadJSONCycles = async () => {
  const { data } = await getGithubJSON('/cycles.json');
  return data as IArkhamDB.JSON.Cycle[];
}

export const loadJSONPacks = async () => {
  const { data } = await getGithubJSON('/packs.json');
  return data as IArkhamDB.JSON.Pack[];
}

export const loadJSONEncounters = async () => {
  const { data } = await getGithubJSON('/encounters.json');
  return data as IArkhamDB.JSON.Encounter[];
}

export const loadJSONPackEncounterCards = async ({ code, cycle_code }: IArkhamDB.HasCycleCode & IArkhamDB.HasCode) => {
  const { data } = await getGithubJSON(`/pack/${cycle_code}/${code}_encounter.json`);
  return data as IArkhamDB.JSON.EncounterCard[];
}

export const loadFolderContents = async (path: string) => {
  const { data } = await getGithubContents<IGithub.Contents.Item[]>(path, {
    responseType: 'text'
  });
  return data;
}

export const loadTranslationLanguages = async () => {
  const data = await loadFolderContents('/translations');
  return data.map(prop('name'));
}