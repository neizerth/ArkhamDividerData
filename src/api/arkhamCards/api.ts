import * as C from "@/config/api";
// import { getWithPrefix } from "@/api/request";
import { getWithPrefix, getContents } from "../fileRepo";

import type { IArkhamCards } from "@/types/arkhamCards";
import type { IIcoMoon } from "@/types/icomoon";
import type { Mapping } from "@/types/common";
import type { IPOEditor } from "@/types/i18n";
import type { IArkhamDB } from "@/types/arkhamDB";

// URL versions
// const getGithubRaw = getWithPrefix(GITHUB_RAW_BASE_URL);
// const getGithubContents = getWithPrefix(GITHUB_CONTENTS_BASE_URL);
// const getDataRaw = getWithPrefix(GITHUB_DATA_RAW_BASE_URL);

const getGithubRaw = getWithPrefix(C.ARKHAM_CARDS_CONTENTS_FOLDER_NAME);
const getDataRaw = getWithPrefix(C.ARKHAM_CARDS_DATA_FOLDER_NAME);

const getGithubContents = getContents(C.ARKHAM_CARDS_CONTENTS_FOLDER_NAME);

export const withLanguagePostfix =
	<T>(getUrl: (language: string) => string) =>
	async (language: string) => {
		const postfix = language === "en" ? "" : `_${language.replace("-", "_")}`;
		const url = getUrl(postfix);
		const { data } = await getGithubRaw<T>(url);
		return data;
	};

export const loadIcons = async () => {
	const { data } = await getGithubRaw<IIcoMoon.Project>(
		"/assets/icomoon/project.json",
	);
	return data;
};

export const loadIconsPatch = async () => {
	const { data } = await getGithubRaw<string>("/src/icons/EncounterIcon.tsx", {
		responseType: "text",
	});
	return data;
};

export const loadCoreTranslations = async (language: string) => {
	const key = language.replace("_", "-");
	const { data } = await getGithubRaw<IPOEditor.Source>(
		`/assets/i18n/${key}.po.json`,
	);
	return data;
};

export const loadFolderContents = async (path: string) => {
	const { data } = await getGithubContents(path);
	return data;
};

export const loadCampaignTranslationLanguages = async () => {
	const data = await loadFolderContents("/assets/generated");
	const prefix = "all_campaigns_";
	const languages = data
		.filter((name) => name.startsWith(prefix))
		.map((name) => name.replace(prefix, "").replace(".txt", ""));

	return ["en", ...languages];
};

export const loadJSONPacks = async () => {
	const { data } =
		await getDataRaw<IArkhamCards.JSON.Pack[]>("/packs/packs.json");
	return data;
};

export const loadJSONCycles = async () => {
	const { data } =
		await getDataRaw<IArkhamCards.JSON.Cycle[]>("/packs/cycles.json");
	return data;
};

export const loadJSONStandaloneScenarios = async () => {
	const { data } = await getGithubRaw<IArkhamCards.JSON.StandaloneScenario[]>(
		"/assets/generated/standalone_scenarios.txt",
	);
	return data;
};

export const loadJSONEncounterSets = async () => {
	const { data } = await getDataRaw<IArkhamCards.EncounterSet[]>(
		"/encounter_sets.json",
	);
	return data;
};

export const loadJSONPackCards = async (code: string) => {
	const { data } = await getDataRaw<IArkhamDB.JSON.Card[]>(
		`/cards/${code}.json`,
		{
			defaultData: [],
		},
	);
	return data;
};

export const loadLocalJSONPackCards = async (
	code: string,
	language: string,
) => {
	const { data } = await getDataRaw<IArkhamDB.JSON.Card[]>(
		`/i18n/${language}/cards/${code}.json`,
		{
			defaultData: [],
		},
	);
	return data;
};

// translations

export const loadСampaigns = withLanguagePostfix<
	IArkhamCards.JSON.FullCampaign[]
>((language: string) => `/assets/generated/all_campaigns${language}.txt`);

export const loadEncounterSets = withLanguagePostfix<Mapping>(
	(language: string) => `/assets/generated/encounter_sets${language}.txt`,
);
