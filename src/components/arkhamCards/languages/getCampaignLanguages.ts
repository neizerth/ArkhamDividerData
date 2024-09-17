import { loadCampaignTranslationLanguages } from "@/api/arkhamCards/api"

export const getCampaignLanguages = async () => {
  return await loadCampaignTranslationLanguages();
}