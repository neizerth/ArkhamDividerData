import { loadPackCards } from "@/api/arkhamDB/api";
import { withCode } from "@/api/arkhamDB/criteria";
import { getCampaignType } from "@/api/arkhamDB/util";
import { IArkhamDB } from "@/types/arkhamDB";
import { delay } from "@/util/common";
import { prop, propEq } from "ramda";

type ILinkPacksEncounterSets = {
  packs: IArkhamDB.JSON.Pack[],
  cycles: IArkhamDB.JSON.Cycle[]
}

export const linkPacksEncounterSets = async ({ packs, cycles }: ILinkPacksEncounterSets) => {
  const data = [] as IArkhamDB.JSON.ExtendedPack[];
  for (const pack of packs) {
    console.log(`gettting pack ${pack.cycle_code}/${pack.code}...`);
    await delay(100);
    const encounterSets = await getPackEncounterSets(pack);
    
    if (encounterSets.length === 0) {
      continue;
    }

    const cycle = cycles.find(withCode(pack.cycle_code)) as IArkhamDB.JSON.Cycle;
    const campaignType = getCampaignType(cycle);

    data.push({
      ...pack,
      campaign_type: campaignType,
      encounter_sets: encounterSets
    });
  }

  return data;
}


export const getPackEncounterSets = async (pack: IArkhamDB.JSON.Pack) => {
  const cards = await loadPackCards(pack);
  return cards
    .map(prop('encounter_code'))
    .reduce((target, code) => {
      if (!code) {
        return target;
      }

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
        code,
        size: 1
      }) 
      return [...target, ];
    }, [] as IArkhamDB.JSON.EncounterSet[]);
}