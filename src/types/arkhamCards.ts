import { IArkhamDB } from "./arkhamDB";
import { Mapping } from "./common"

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
  
  export type CustomContent = {
    creator: string;
    download_link: Mapping
  }

  export type EncounterSet = {
    pack_code?: string;
    cycle_code?: string;
    code: string;
    name: string;
    size?: number;
  }

  export namespace JSON {
    export type Cycle = IArkhamDB.JSON.Cycle & {
      official: boolean;
    }
    export type Campaign = {
      id: string
      position: number
      version: number
      name: string
      campaign_type: CampaignType,
      scenarios: string[]
      custom?: CustomContent;
    }
    export type ScenarioStep = {
      id: string;
      type: string;
      encounter_sets?: string[]
    }
    export type StandaloneScenario = {
      type: string
      campaignId: string
      scenarioId: string
    }
    export type Scenario = {
      id: string;
      scenario_name: string;
      full_name: string;
      header: string;
      custom?: CustomContent;
      side_scenario_type: ScenarioType;
      setup: string[];
      icon: string;
      steps: ScenarioStep[]
    }
    export type FullCampaign = {
      campaign: Campaign
      scenarios: Scenario[]
    }
    export type Pack = {
      code: string;
      cycle_code: string;
      name: string;
      position: number;
    }
    export type ExtendedPack = Pack & {
      encounter_sets: IArkhamDB.JSON.PackEncounterSet[]
      campaign_type: IArkhamDB.CampaignType
      is_custom: boolean
      is_canonical?: boolean 
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
      icon?: string
    }

    export type Campaign = {
      id: string
      cycle_code?: string
      pack_code?: string
      position?: number
      version?: number
      name: string
      campaign_type: CampaignType | ScenarioType,

      encounter_sets: string[];
      is_scenario: boolean;
      is_custom: boolean
      custom?: CustomContent;
      scenarios: string[];
    }

    export type ExtendedCampaign = Omit<Campaign, 'scenarios'> & {
      scenarios: Scenario[]
    }
  }

}