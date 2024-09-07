import { loadPackCards } from "@/api/arkhamDB/api";
import { IArkhamDB } from "@/types/arkhamDB";
import { delay, unique } from "@/util/common";
import { identity, prop } from "ramda";

export const linkPacksEncounterSets = async (packs: IArkhamDB.JSON.Pack[]) => {
  const data = [] as IArkhamDB.JSON.ExtendedPack[];
  for (const pack of packs) {
    console.log(`gettting pack ${pack.cycle_code}/${pack.code}...`);
    await delay(100);
    const codes = await getPackEncounterCodes(pack);
    
    if (codes.length === 0) {
      continue;
    }

    data.push({
      ...pack,
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