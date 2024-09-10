import { loadCampaignTranslationLanguages } from "@/api/arkhamCards/api"

export const getCampaignLanguagesCache = async () => {
  console.log('getting available campaign languages...')
  return await loadCampaignTranslationLanguages();
}