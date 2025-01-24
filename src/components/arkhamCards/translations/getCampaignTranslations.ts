import type { Mapping, SingleValue } from "@/types/common";
import * as Cache from "@/util/cache";
import { getCampaigns } from "@/components/arkhamCards/campaigns/getCampaigns"
import { propEq } from "ramda";
import type { IArkhamCards } from "@/types/arkhamCards";

type FullCampaigns = ReturnType<typeof Cache.getCampaigns>;
type FullCampaign = SingleValue<FullCampaigns>;

export const getCampaignTranslations = async (language: string) => {
  const campaigns = await getCampaigns(language);

  return getFullCampaignTranslations(campaigns);
}

export const includeScenarioStepsTranslation = (
  baseScenario: IArkhamCards.JSON.Scenario, 
  localScenario: IArkhamCards.JSON.Scenario
) => {
  return localScenario.steps.reduce((target, { title }, index) => {
    if (!title) {
      return target;
    }
    const baseStep = baseScenario.steps[index];

    if (!baseStep.title) {
      return target;
    }

    if (baseStep.title === title) {
      return target;
    }

    return {
      ...target,
      [baseStep.title]: title
    }
  }, {} as Mapping)
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
    } = baseScenario;

    const isTranslated = localScenario.scenario_name && 
      localScenario.scenario_name !== scenario_name;

    if (isTranslated) {
      translated.push(id);
    }
    
    const includeTranslation = (key: keyof typeof localScenario) => {
      if (baseScenario[key] === localScenario[key]) {
        return {}
      }
      return {
        [baseScenario[key] as string]: localScenario[key] as string
      }
    }

    return {
      ...target,
      ...includeTranslation('scenario_name'),
      ...includeTranslation('full_name'),
      ...includeTranslation('header'),
      ...includeScenarioStepsTranslation(baseScenario, localScenario)
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

      target.campaigns[baseCampaign.campaign.name] = name;
    }

    const { scenarios, translated } = getScenarioTranslations(localCampaign, baseCampaign)

    target.translated.scenarios.push(...translated);
    target.scenarios = {
      ...target.scenarios,
      ...scenarios
    }

    return target;
  }, mappingGroup);
}