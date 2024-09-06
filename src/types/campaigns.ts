import { IArkhamCards } from "@/types/arkhamCards";

export type ICampaign = IArkhamCards.FullCampaign & {
  encounter_sets: string[]
}
