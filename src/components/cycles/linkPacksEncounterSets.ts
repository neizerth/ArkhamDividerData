import { loadPackCards } from "@/api/arkhamDB/api";
import { getCampaignType } from "@/api/arkhamDB/util";
import { IArkhamDB } from "@/types/arkhamDB";
import { delay } from "@/util/common";
import { identity, prop, propEq } from "ramda";

export const linkPacksEncounterSets = async (packs: IArkhamDB.JSON.Pack[]) => {
  const data = [] as IArkhamDB.JSON.ExtendedPack[];
  for (const pack of packs) {
    console.log(`gettting pack ${pack.cycle_code}/${pack.code}...`);
    await delay(100);
    const encounterSets = await getPackEncounterSets(pack);
    
    if (encounterSets.length === 0) {
      continue;
    }

    const campaignType = getCampaignType(pack.cycle_code);

    data.push({
      ...pack,
      is_custom: false,
      campaign_type: campaignType,
      encounter_sets: encounterSets
    });
  }

  return data;
}


export const getPackEncounterSets = async (pack: IArkhamDB.JSON.Pack) => {
  const cards = await loadPackCards(pack);
  const codes = cards.map(prop('encounter_code'))
    .filter(identity) as string[];

  return toPackEncounterSet(pack, codes)
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