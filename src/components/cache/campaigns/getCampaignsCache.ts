
import { IArkhamCards } from "@/types/arkhamCards";
import { unique } from "@/util/common";
import { loadСampaigns } from "@/api/arkhamCards/api";

export const getCampaignsCache = async () => {
  const campaignsJSON = await loadСampaigns('en');
  
  // console.log(campaignsJSON);
  return campaignsJSON.map(parseCampaign);
}


export const getStepEncounterSets = ({ steps }: IArkhamCards.JSON.Scenario) => {
  const step = steps.find(({ type }) => type === 'encounter_sets');

  return step?.encounter_sets || [];
}

export const parseCampaign = ({ campaign, scenarios }: IArkhamCards.JSON.FullCampaign): IArkhamCards.Parsed.Campaign => {
  const { 
    id,
    position,
    version,
    name,
    campaign_type 
  } = campaign;
  const encounterSets = scenarios.map(getStepEncounterSets).flat();
  const uniqueEncounterSets = unique(encounterSets);

  return {
    id,
    position,
    version,
    name,
    campaign_type,
    encounter_sets: uniqueEncounterSets,
  }
}

// export const isCoreCampaign = ({ campaign }: ICampaign) => campaign.id === 'core' && campaign.position === 0;

// export const getCoreEntrounterSet = (campaigns: ICampaign[]) => campaigns.find(isCoreCampaign)?.encounter_sets || [];