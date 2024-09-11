
import { prop } from "ramda";
import { IArkhamCards } from "@/types/arkhamCards";
import { loadСampaigns } from "@/api/arkhamCards/api";

import { getMainCampaigns } from "./getMainCampaigns";
import { getSideScenarios } from "./getSideScenarios";
import { ICache } from "@/types/cache";

export const getAdventures = async (language = 'en'): Promise<ICache.Adventure[]> => {
  const data = await loadСampaigns(language);

  const campaigns = getMainCampaigns(data);
  // const scenarios = getSideScenarios(data);
}

