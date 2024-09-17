import { Mapping, SingleValue } from "@/types/common";
import * as Cache from "@/util/cache";
import { getCampaigns } from "@/components/arkhamCards/campaigns/getCampaigns"
import { propEq } from "ramda";

type FullCampaigns = ReturnType<typeof Cache.getCampaigns>;
type FullCampaign = SingleValue<FullCampaigns>;

export const getCampaignTranslations = async (language: string) => {
  const campaigns = await getCampaigns(language);

  return getFullCampaignTranslations(campaigns);
}

export const getScenarioTranslations = (localCampaign: FullCampaign, baseCampaign: FullCampaign) => {
  const translated = [] as string[];
  const scenarios = localCampaign.scenarios.reduce((target, localScenario) => {
    const baseScenario = baseCampaign.scenarios.find(propEq(localScenario.id, 'id'));

    if (!baseScenario) {
      return target;
    }

    const {
      id,
      scenario_name,
      full_name,
      header
    } = baseScenario;

    const isTranslated = localScenario.scenario_name && 
      localScenario.scenario_name !== scenario_name;

    if (isTranslated) {
      translated.push(id);
    }

    return {
      ...target,
      [scenario_name]: localScenario.scenario_name,
      [full_name]: localScenario.full_name,
      [header]: localScenario.header
    };
  }, {} as Mapping);

  return {
    scenarios,
    translated
  }
}

export const getFullCampaignTranslations = (campaigns: FullCampaigns) => {
  const baseCampaigns = Cache.getCampaigns();

  const mappingGroup = {
    translated: {
      campaigns: [] as string[],
      scenarios: [] as string[]
    },
    campaigns: {} as Mapping,
    scenarios: {} as Mapping
  }

  return campaigns.reduce((target, localCampaign) => {
    const { id } = localCampaign.campaign;
    const baseCampaign = baseCampaigns.find(
      ({ campaign: baseCampaign }) => baseCampaign.id === id
    );
    if (!baseCampaign) {
      return target
    }
    const { name } = localCampaign.campaign;
    const isTranslated = name && name !== baseCampaign.campaign.name; 

    if (isTranslated) {
      target.translated.campaigns.push(id);
    }

    target.campaigns[baseCampaign.campaign.name] = name;

    const { scenarios, translated } = getScenarioTranslations(localCampaign, baseCampaign)

    target.translated.scenarios.push(...translated);
    target.scenarios = {
      ...target.scenarios,
      ...scenarios
    }

    return target;
  }, mappingGroup);
}