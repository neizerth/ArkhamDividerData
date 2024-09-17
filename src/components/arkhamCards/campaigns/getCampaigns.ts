import * as API from "@/api/arkhamCards/api";

export const getCampaigns = async (language = 'en') => {
  return await API.loadСampaigns(language);
}