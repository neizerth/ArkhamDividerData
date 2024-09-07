import { GITHUB_CONTENTS_BASE_URL, GITHUB_RAW_BASE_URL } from "@/config/api";
import { fetchIcomoonProject } from "../arkhamCardsOld";
import { getWithPrefix } from "../request";
import { IArkhamCards } from "@/types/arkhamCards";
import { IIcoMoon } from "@/types/icomoon";

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


export const loadСampaigns = withLanguagePostfix<IArkhamCards.JSON.FullCampaign[]>(
  (language: string) => `/assets/generated/allCampaigns${language}.json`
);

export const loadEncounterSets = withLanguagePostfix<IArkhamCards.Mapping[]>(
  (language: string) => `/assets/generated/encounterSets${language}.json`
);
