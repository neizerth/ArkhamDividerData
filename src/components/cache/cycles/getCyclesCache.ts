import { loadJSONCycles, loadJSONEncounters, loadJSONPacks, loadPackCards } from "@/api/arkhamDB/api";
import { RETURN_CYCLE_CODE } from "@/api/arkhamDB/constants";
import { withCode, withoutCode } from "@/api/arkhamDB/criteria";
import { withReturnSetCode } from "@/api/arkhamDB/util";
import { IArkhamDB } from "@/types/arkhamDB";
import { unique } from "@/util/common";
import { linkPacksEncounterSets } from "./linkPacksEncounterSets";

export const getCyclesCache = async () => {
  const packsJSON = await loadJSONPacks();
  const cyclesJSON = await loadJSONCycles();
  const encountersJSON = await loadJSONEncounters();

  const packs = await linkPacksEncounterSets(packsJSON);

  const encounterSets = encountersJSON
    .map(withPackCode(packs));

  const cycles = cyclesJSON
    .filter(withoutCode(RETURN_CYCLE_CODE))
    .map(appendCycleData(packs))
    .filter(withoutEmptyEncounters)

  return {
    encounterSets,
    packs,
    cycles
  }
}

export const withoutEmptyEncounters = ({ encounter_codes }: IArkhamDB.JSON.ExtendedCycle) => encounter_codes.length > 0;

export const appendCycleData = (packs: IArkhamDB.JSON.ExtendedPack[]) => {
  const returnPacks = packs.filter(withCode(RETURN_CYCLE_CODE));
  const applyReturnCode = withReturnSetCode(returnPacks);

  return (cycle: IArkhamDB.JSON.Cycle): IArkhamDB.JSON.ExtendedCycle => {
    const cyclePacks = packs.filter(withCode(cycle.code));
    
    const codes = cyclePacks.reduce(
      (data, pack) => [...data, ...pack.encounter_codes], 
      [] as string[]
    );

    return {
      ...applyReturnCode(cycle),
      encounter_codes: unique(codes)
    }
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
