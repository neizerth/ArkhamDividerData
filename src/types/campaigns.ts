import { IArkhamCardsCampaign, IArkhamCardsScenarioDetail } from "@/types/arkhamCards";

export type ICampaign = IArkhamCardsCampaign & {
  encounter_sets: string[]
}
