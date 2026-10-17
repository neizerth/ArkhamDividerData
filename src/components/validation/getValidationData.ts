import validationData from "./data";
import type { CampaignValidationData } from "./types";

export const getAllCampaignValidationData = (): CampaignValidationData[] =>
	validationData;

export const getCampaignValidationData = (
	code: string,
): CampaignValidationData | undefined =>
	validationData.find((item) => item.code === code);
