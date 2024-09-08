
import { IArkhamCards } from "@/types/arkhamCards";
import { loadСampaigns } from "@/api/arkhamCards/api";
import { getMainCampaigns } from "./getMainCampaigns";
import { prop } from "ramda";
import { getSideScenarios } from "./getSideScenarios";

export const getCampaignsCache = async () => {
  const campaignsJSON = await loadСampaigns('en');
  const campaigns = getCampaigns(campaignsJSON);

  return withScenarios(campaigns);
}

export const withScenarios = (data: IArkhamCards.Parsed.ExtendedCampaign[]) => {
  const scenarios = data.map(prop('scenarios')).flat();
  
  const campaigns: IArkhamCards.Parsed.Campaign[] = data
    .map(({ scenarios, ...campaign }) => ({
      ...campaign,
      scenarios: scenarios.map(prop('id'))
    }));

  return {
    scenarios,
    campaigns
  }
}

export const getCampaigns = (campaigns: IArkhamCards.JSON.FullCampaign[]) => {

  const mainCampaigns = getMainCampaigns(campaigns);
  const sideScenarios = getSideScenarios(campaigns);
  
  return [
    ...mainCampaigns,
    ...sideScenarios
  ];
}
// export const isCoreCampaign = ({ campaign }: ICampaign) => campaign.id === 'core' && campaign.position === 0;

// export const getCoreEntrounterSet = (campaigns: ICampaign[]) => campaigns.find(isCoreCampaign)?.encounter_sets || [];