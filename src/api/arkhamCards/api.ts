import { GITHUB_CONTENTS_BASE_URL, GITHUB_RAW_BASE_URL } from "@/config/api";
import { getWithPrefix } from "../request";
import { IArkhamCards } from "@/types/arkhamCards";
import { IIcoMoon } from "@/types/icomoon";
import { Mapping } from "@/types/common";
import { IGithub } from "@/types/github";
import { prop } from "ramda";
import { IPOEditor } from "@/types/i18n";

const getGithubRaw = getWithPrefix(GITHUB_RAW_BASE_URL);
const getGithubContents = getWithPrefix(GITHUB_CONTENTS_BASE_URL);

export const withLanguagePostfix = <T>(getUrl: (language: string) => string) => async (language: string) => {
  const postfix = language === 'en' ? '' : '_' + language;
  const url = getUrl(postfix);
  const { data } = await getGithubRaw<T>(url);
  return data;
}

export const loadIcons = async () => {
  const { data } = await getGithubRaw<IIcoMoon.Project>('/assets/icomoon/project.json');
  return data;
}

export const loadIconsPatch = async () => {
  const { data } = await getGithubRaw<string>('/src/icons/EncounterIcon.tsx', {
    responseType: 'text'
  });
  return data;
}

export const loadCoreTranslations = async (language: string) => {
  const { data } = await getGithubRaw<IPOEditor.Source>(`/assets/i18n/${language}.po.json`);
  return data;
}

export const loadFolderContents = async (path: string) => {
  const { data } = await getGithubContents<IGithub.Contents.Item[]>(path);
  return data;
}

export const loadTranslationLanguages = async () => {
  const data = await loadFolderContents('/assets/generated');
  const prefix = 'allCampaigns_';
  const languages = data
    .map(prop('name'))
    .filter(name => name.startsWith(prefix))
    .map(name => name.replace(prefix, '').replace('.json', ''))
    
  return [
    'en',
    ...languages
  ]
}

// translations

export const loadСampaigns = withLanguagePostfix<IArkhamCards.JSON.FullCampaign[]>(
  (language: string) => `/assets/generated/allCampaigns${language}.json`
);

export const loadEncounterSets = withLanguagePostfix<Mapping>(
  (language: string) => `/assets/generated/encounterSets${language}.json`
);
