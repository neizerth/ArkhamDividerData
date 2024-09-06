export namespace IArkhamCards {
  export type CampaignType = 'campaign' | 'standalone';
  export type Campaign = {
    id: string
    position: number
    version: number
    name: string
    campaign_type: CampaignType,
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
    setup: string[];
    icon: string;
    steps: ScenarioStep[]
  }
  export type FullCampaign = {
    campaign: Campaign
    scenarios: Scenario[]
  }
}