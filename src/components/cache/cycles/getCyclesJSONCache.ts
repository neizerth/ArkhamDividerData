import { loadJSONCycles, loadJSONEncounters, loadJSONPackEncounterCards, loadJSONPacks } from "@/api/arkhamDB/api";
import { RETURN_CYCLE_CODE } from "@/api/arkhamDB/constants";
import { withoutCode } from "@/api/arkhamDB/criteria";
import { withReturnSetCode } from "@/api/arkhamDB/util";
import { IArkhamDB } from "@/types/arkhamDB";
import { delay, unique } from "@/util/common";
import { groupBy, prop } from "ramda";

export const getCyclesJSONCache = async () => {
  const packsJSON = await loadJSONPacks();
  const cyclesJSON = await loadJSONCycles();
  const encountersJSON = await loadJSONEncounters();

  const cycles = cyclesJSON
    .filter(withoutCode(RETURN_CYCLE_CODE))
    .map(withReturnSetCode(packsJSON));

  // const packs = await linkPacksEncounterSets(packsJSON);
  // const encounterSets = encountersJSON.map(withPackCode(packs));

  return {
    encounterSets: [],
    // encounterSets,
    packs,
    cycles
  }
}


export const withPackCode = (packs: IArkhamDB.JSON.ExtendedPack[]) => 
  (encounter: IArkhamDB.JSON.Encounter): IArkhamDB.JSON.ExtendedEncounter => {
    
    const pack = packs.find(
      ({ encounter_codes }) => encounter_codes.includes(encounter.code)
    );

    const packCode = pack?.code as string;
    const cycleCode = pack?.cycle_code as string;

    return {
      ...encounter,
      pack_code: packCode,
      cycle_code: cycleCode
    };
  }

export const linkPacksEncounterSets = async (packs: IArkhamDB.JSON.Pack[]) => {
  const groups = groupBy(prop('cycle_code'), packs);
  const packGroups = Object.values(groups) as IArkhamDB.JSON.Pack[][];

  const data = [];
  for (const cyclePacks of packGroups) {
    const encounters = await linkCyclePacksEncounterSets(cyclePacks);
    data.push(...encounters);
  }

  return data;
}

export const linkCyclePacksEncounterSets = async (cyclePacks: IArkhamDB.JSON.Pack[]) => {
  const data = [] as IArkhamDB.JSON.ExtendedPack[];

  for (const pack of cyclePacks) {
    const { code, cycle_code } = pack;
    console.log(`getting encounters for pack: ${cycle_code}/${code}`);
    
    await delay(100);
    const encounterCards = await loadJSONPackEncounterCards(pack);
    const codes = encounterCards.map(prop('encounter_code'));
    
    data.push({
      ...pack,
      encounter_codes: unique(codes)
    });

    // break;
  }

  return data;
  // const encounters = await loadJSONPackEncounters();
}
