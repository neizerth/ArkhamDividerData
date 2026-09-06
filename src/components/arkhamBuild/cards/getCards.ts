import * as API from "@/api/arkhamBuild/api";
import type { IArkhamBuild } from "@/types/arkhamBuild";

export const getCards = async (
	language: string,
): Promise<IArkhamBuild.Card[]> => {
	return API.loadCards(language);
};

export const getInvestigators = async (
	language = "en",
): Promise<IArkhamBuild.Investigator[]> => {
	return API.loadInvestigators(language);
};
