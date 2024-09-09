import { loadJSONCycles, loadJSONEncounters, loadJSONPacks } from "@/api/arkhamDB/api";
import { RETURN_CYCLE_CODE } from "@/api/arkhamDB/constants";
import { withoutCode } from "@/api/arkhamDB/criteria";
import { getCampaignType, withReturnSetCode } from "@/api/arkhamDB/util";
import { IArkhamDB } from "@/types/arkhamDB";
import { unique } from "@/util/common";
import { linkPacksEncounterSets } from "./linkPacksEncounterSets";
import { identity, prop, propEq, propIs } from "ramda";

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
    .map(withPack(packs))
    .filter(identity);

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
      (data, pack) => [
        ...data, 
        ...pack.encounter_sets.map(prop('code'))
      ], 
      [] as string[]
    );

    const isSizeSupported = cyclePacks.every(propIs(Number, 'size'));

    return {
      ...applyReturnCode(cycle),
      campaign_type: getCampaignType(cycle),
      pack_codes: packCodes,
      encounter_codes: unique(codes),
      is_size_supported: isSizeSupported
    }
  }
}


export type Pack = IArkhamDB.JSON.ExtendedPack;
export type PackEncounterSet = IArkhamDB.JSON.PackEncounterSet;
export type ExtendedEncounter = IArkhamDB.JSON.ExtendedEncounter;
export type Encounter = IArkhamDB.JSON.ExtendedEncounter;

export const withPack = (packs: Pack[]) => {
  const packEncounterSets = packs.map(prop('encounter_sets')).flat();

  return (encounter: IArkhamDB.JSON.Encounter): ExtendedEncounter | false => {
    
    const packEncounterSet = packEncounterSets.find(propEq(encounter.code, 'code'));
    
    const size = packEncounterSet?.size
    const packCode = packEncounterSet?.pack_code;
    const cycleCode = packEncounterSet?.cycle_code

    if (!packEncounterSet) {
      console.log(`encounter set ${encounter.code} not found!`);
    }

    return {
      ...encounter,
      pack_code: packCode,
      cycle_code: cycleCode,
      size
    };
  }

}