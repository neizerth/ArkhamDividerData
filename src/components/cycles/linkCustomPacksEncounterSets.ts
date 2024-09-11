import { loadJSONPackCards } from "@/api/arkhamCards/api";
import { IArkhamCards } from "@/types/arkhamCards";
import { delay } from "@/util/common";
import { identity, prop } from "ramda";
import { toPackEncounterSet } from "./linkPacksEncounterSets";
import { getCustomCampaignType } from "@/api/arkhamCards/util";
import { NON_CANONICAL_CODE } from "@/api/arkhamCards/constants";

export const linkCustomPacksEncounterSets = async (packs: IArkhamCards.JSON.Pack[]) => {
  const data = [] as IArkhamCards.JSON.ExtendedPack[];
  for (const pack of packs) {
    await delay(200);
    const encounterSets = await getCustomPackEncounterSets(pack);

    if (encounterSets.length === 0) {
      continue;
    }

    const campaignType = getCustomCampaignType(pack.cycle_code);
    const isCanonical = pack.cycle_code !== NON_CANONICAL_CODE;

    data.push({
      ...pack,
      campaign_type: campaignType,
      encounter_sets: encounterSets,
      is_canonical: isCanonical,
      is_custom: !isCanonical
    });
  }

  return data;
}

const getCustomPackEncounterSets = async (pack: IArkhamCards.JSON.Pack) => {
  console.log(`loading pack ${pack.code} cards...`);
  const cards = await loadJSONPackCards(pack.code);
  const codes = cards
    .map(prop('encounter_code'))
    .filter(identity) as string[];

  return toPackEncounterSet(pack, codes);
}