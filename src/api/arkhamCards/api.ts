import { GITHUB_CONTENTS_BASE_URL, GITHUB_RAW_BASE_URL } from "@/config/api";
import { fetchIcomoonProject } from "../arkhamCardsOld";
import { getWithPrefix } from "../request";

const getGithubRaw = getWithPrefix(GITHUB_RAW_BASE_URL);
const getGithubContents = getWithPrefix(GITHUB_CONTENTS_BASE_URL);

export const withLanguagePostfix = <T>(getUrl: (language: string) => string) => async (language: string) => {
  const postfix = language === 'en' ? '' : '_' + language;
  const url = getUrl(postfix);
  const { data } = await getGithubRaw(url);
  return data as T;
}

export const loadIcons = async () => {
  const { data } = await getGithubRaw('/assets/icomoon/project.json');
  return data;
}

export const loadIconsPatch = async () => {
  const { data } = await getGithubRaw('/src/icons/EncounterIcon.tsx', {
    responseType: 'text'
  });
  return data;
}

export const loadСampaigns = withLanguagePostfix((language: string) => `/assets/generated/allCampaigns${language}.json`);
