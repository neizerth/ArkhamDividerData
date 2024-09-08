import { IArkhamCards } from "@/types/arkhamCards"
import { Mapping } from "@/types/common";

type Scenario = IArkhamCards.Parsed.Scenario;

export const getScenarioMapping = (baseScenarios: Scenario[], localScenarios: Scenario[]) => 
  localScenarios.reduce((target, localScenario) => {
    const baseCampaign = baseScenarios.find(({ id, campaign_id }) => {
      return id === localScenario.id && campaign_id === localScenario.campaign_id;
    });

    if (!baseCampaign) {
      return target;
    }
    const {
      full_name,
      header,
      scenario_name
    } = baseCampaign

    return {
      ...target,
      [full_name]: localScenario.full_name,
      [header]: localScenario.header,
      [scenario_name]: localScenario.scenario_name
    };
  },
  {} as Mapping
)