import { loadPackCards } from "../../../api/arkhamDB/api";
import { withCode } from "../../../api/arkhamDB/criteria";
import { getCampaignType } from "../../../api/arkhamDB/util";
import { IArkhamDB } from "../../../types/arkhamDB";
import { delay, unique } from "../../../util/common";
import { identity, prop } from "ramda";

type ILinkPacksEncounterSets = {
  packs: IArkhamDB.JSON.Pack[],
  cycles: IArkhamDB.JSON.Cycle[]
}

export const linkPacksEncounterSets = async ({ packs, cycles }: ILinkPacksEncounterSets) => {
  const data = [] as IArkhamDB.JSON.ExtendedPack[];
  for (const pack of packs) {
    console.log(`gettting pack ${pack.cycle_code}/${pack.code}...`);
    await delay(100);
    const codes = await getPackEncounterCodes(pack);
    
    if (codes.length === 0) {
      continue;
    }

    const cycle = cycles.find(withCode(pack.cycle_code)) as IArkhamDB.JSON.Cycle;
    const campaignType = getCampaignType(cycle);

    data.push({
      ...pack,
      campaign_type: campaignType,
      encounter_codes: codes
    });
  }

  return data;
}

export const getPackEncounterCodes = async (pack: IArkhamDB.JSON.Pack) => {
  const cards = await loadPackCards(pack);
  const codes = cards
    .map(prop('encounter_code'))
    .filter(identity);

  const uniqCodes = unique(codes) as string[];

  return uniqCodes;
}