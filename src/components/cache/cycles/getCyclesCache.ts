import { loadJSONCycles, loadJSONEncounters, loadJSONPacks } from "@/api/arkhamDB/api";
import { RETURN_CYCLE_CODE } from "@/api/arkhamDB/constants";
import { withoutCode } from "@/api/arkhamDB/criteria";
import { getCampaignType, withReturnSetCode } from "@/api/arkhamDB/util";
import { IArkhamDB } from "@/types/arkhamDB";
import { unique } from "@/util/common";
import { linkPacksEncounterSets } from "./linkPacksEncounterSets";
import { prop, propEq } from "ramda";

export const getCyclesCache = async () => {
  console.log('loading packs...');
  const packsJSON = await loadJSONPacks();

  console.log('loading cycles...');
  const cyclesJSON = await loadJSONCycles();

  console.log('loading encounters...');
  const encountersJSON = await loadJSONEncounters();

  const packs = await linkPacksEncounterSets({
    packs: packsJSON,
    cycles: cyclesJSON
  });

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
  const returnPacks = packs.filter(propEq(RETURN_CYCLE_CODE, 'cycle_code'));
  const applyReturnCode = withReturnSetCode(returnPacks);

  return (cycle: IArkhamDB.JSON.Cycle): IArkhamDB.JSON.ExtendedCycle => {
    const cyclePacks = packs.filter(propEq(cycle.code, 'cycle_code'));
    const packCodes = cyclePacks.map(prop('code'));
    
    const codes = cyclePacks.reduce(
      (data, pack) => [...data, ...pack.encounter_codes], 
      [] as string[]
    )

    return {
      ...applyReturnCode(cycle),
      campaign_type: getCampaignType(cycle),
      pack_codes: packCodes,
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
