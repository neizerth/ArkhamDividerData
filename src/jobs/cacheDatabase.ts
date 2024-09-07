import { getCampaignsFromCache, getCyclesFromCache } from "@/components";
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { RecordValue } from "@/types/common";
import { IDatabase } from "@/types/database";

export const cacheDatabase = () => {
  const campaigns = getCampaigns();
  // const campaigns = 
}

type CampaignsMap = Map<string, IArkhamCards.Parsed.Campaign>;

export const getCampaigns = () => {
  const cycles = getCyclesFromCache();
  const campaigns = getCampaignsFromCache();

  const campaignsMap: CampaignsMap = campaigns.reduce(
    (target, campaign) => {
      target.set(campaign.id, campaign);
      return target;
    },
    new Map()
  );

  const officialCampaigns = cycles.map(toDatabaseCampaign(campaignsMap));
}

export const toDatabaseCampaign = (campaignsMap: CampaignsMap) => 
  (cycle: IArkhamDB.JSON.ExtendedCycle): IDatabase.Campaign => {
    const campaign = campaignsMap.get(cycle.code);

    if (!campaign) {
      return cycle;
    }

    return {
      ...cycle,
      ...campaign
    }
  }
