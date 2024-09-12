
import { identity, prop } from "ramda";
import { loadJSONPackCards } from "@/api/arkhamCards/api";
import { IArkhamCards } from "@/types/arkhamCards";
import { getCustomCampaignType } from "@/api/arkhamCards/util";
import { NON_CANONICAL_CODE } from "@/api/arkhamCards/constants";
import { toPackEncounterSet } from "@/components/arkhamDB/cycles/linkPacksEncounterSets";

import { delay } from "@/util/common";

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

  return getPackSize(pack, codes);
}

export const toPackEncounterSet = (
  pack: IArkhamDB.HasCode & IArkhamDB.HasCycleCode, 
  codes: string[]
) => codes.reduce(
  (target, code) => {

  const index = target.findIndex(propEq(code, 'code'));
  if (index !== -1) {
    const item = target[index];

    return [
      ...target.slice(0, index),
      {
        ...item,
        size: item.size + 1
      },
      ...target.slice(index + 1)
    ]
  }
  target.push({
    cycle_code: pack.cycle_code,
    pack_code: pack.code,
    code,
    size: 1
  }) 
  return [...target, ];
}, [] as IArkhamDB.JSON.PackEncounterSet[]);