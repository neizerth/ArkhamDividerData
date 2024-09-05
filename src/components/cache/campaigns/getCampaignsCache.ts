import { IArkhamCardsCampaign, IArkhamCardsScenarioDetail } from "@/types/arkhamCards";
import { IArkhamDBPack } from "@/types/arkhamDB";
import { ICampaign } from "@/types/campaigns";
import { IIconMapping } from "@/types/icomoon";
import { unique } from "@/util/common";

export type GetCampaignsCacheOptions = {
  campaigns: IArkhamCardsCampaign[],
  iconMapping: IIconMapping
  packs: IArkhamDBPack[]
}

export const getCampaignsCache = ({
  campaigns, 
  iconMapping,
  packs 
}: GetCampaignsCacheOptions) => {
  const campaignCodes = campaigns.map(({ campaign }) => campaign.id);
  const packsCodes = packs.map(({ code }) => code);
  // console.log(packsCodes);
  // console.log(ids);
}


export const scenarioToEncounterSets = ({ steps }: IArkhamCardsScenarioDetail) => {
  const step = steps.find(({ type }) => type === 'encounter_sets');

  return step?.encounter_sets || [];
}

export const transformArkhamCardsCampaign = ({ campaign, scenarios }: IArkhamCardsCampaign): ICampaign => {
  const encounterSets = scenarios.map(scenarioToEncounterSets).flat();
  const uniqueEncounterSets = unique(encounterSets);

  return {
    encounter_sets: uniqueEncounterSets,
    campaign,
    scenarios
  }
}

export const isCoreCampaign = ({ campaign }: ICampaign) => campaign.id === 'core' && campaign.position === 0;

export const getCoreEntrounterSet = (campaigns: ICampaign[]) => campaigns.find(isCoreCampaign)?.encounter_sets || [];