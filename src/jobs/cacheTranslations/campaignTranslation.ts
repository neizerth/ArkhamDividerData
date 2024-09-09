import { IArkhamCards } from "@/types/arkhamCards";
import { Mapping } from "@/types/common";
import { prop, propEq } from "ramda";

type Campaign = IArkhamCards.Parsed.Campaign;

export const getCampaignMapping = (baseCampaigns: Campaign[], localCampaigns: Campaign[]) => 
  localCampaigns.reduce((target, localCampaign) => {
    const baseCampaign = baseCampaigns.find(propEq(localCampaign.id, 'id'));
    
    if (!baseCampaign) {
      return target;
    }
    
    if (baseCampaign.name === localCampaign.name) {
      return target;
    }
    
    const key = baseCampaign.name;

    target[key] = localCampaign.name;

    return target;
  },
  {} as Mapping
)

export const getTranslatedCampaigns = (baseCampaigns: Campaign[], localCampaigns: Campaign[]) => {
  return localCampaigns.filter(campaign => {
    const baseCampaign = baseCampaigns.find(propEq(campaign.id, 'id'));

    if (!baseCampaign) {
      return false;
    }

    return baseCampaign.name !== campaign.name;
  })
  .map(prop('id'));
}