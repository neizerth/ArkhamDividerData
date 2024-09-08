export namespace IArkhamCards {

  export enum ScenarioType {
    STANDALONE = 'standalone',
    SIDE = 'side_story',
    CHALLENGE = 'challenge'
  };

  export enum CampaignType {
    CAMPAIGN = 'campaign',
    STANDALONE = 'standalone',
  };
  
  export namespace JSON {
    export type Campaign = {
      id: string
      position: number
      version: number
      name: string
      campaign_type: string,
      scenarios: string[]
    }
    export type ScenarioStep = {
      id: string;
      type: string;
      encounter_sets?: string[]
    }
    export type Scenario = {
      id: string;
      scenario_name: string;
      full_name: string;
      header: string;
      side_scenario_type: string;
      setup: string[];
      icon: string;
      steps: ScenarioStep[]
    }
    export type FullCampaign = {
      campaign: Campaign
      scenarios: Scenario[]
    }
  }
  export namespace Parsed {
    export type Scenario = {
      id: string
      campaign_id: string;
      encounter_sets: string[]
      scenario_name: string
      full_name: string
      header: string
      icon: string
    }
    export type Campaign = {
      id: string
      position?: number
      version?: number
      name: string
      campaign_type: string

      encounter_sets: string[];
      is_scenario: boolean;
      scenarios: string[]
    }

    export type ExtendedCampaign = Omit<Campaign, 'scenarios'> & {
      scenarios: Scenario[]
    }
  }

}