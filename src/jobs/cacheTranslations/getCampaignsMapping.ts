import { IArkhamCards } from "../../types/arkhamCards";
import { Mapping } from "../../types/common";
import { propEq } from "ramda";

type Campaign = IArkhamCards.Parsed.Campaign;

export const getCampaignMapping = (baseCampaigns: Campaign[], localCampaigns: Campaign[]) => 
  localCampaigns.reduce((target, localCampaign) => {
    const baseCampaign = baseCampaigns.find(propEq(localCampaign.id, 'id'));
    if (!baseCampaign) {
      return target;
    }
    
    const key = baseCampaign.name;
    target[key] = localCampaign.name;

    return target;
  },
  {} as Mapping
)