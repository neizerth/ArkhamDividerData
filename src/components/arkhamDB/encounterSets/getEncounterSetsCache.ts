import { loadEncounterSets } from "@/api/arkhamCards/api";
import { IArkhamCards } from "@/types/arkhamCards";
import { IDatabase } from "@/types/database.old";
import { getCustomPacksFromCache, getPacksFromCache } from "@/util/cache";
import { prop, propEq } from "ramda";

export const getEncounterSetsCache = async () => {
  const encounterSets = await loadEncounterSets('en');

  const customPacks = getCustomPacksFromCache();
  const packs = getPacksFromCache();

  const toEncounterSets = prop('encounter_sets')
  
  const packEncounterSets = [
    ...customPacks.map(toEncounterSets).flat(),
    ...packs.map(toEncounterSets).flat()
  ]

  return Object.entries(encounterSets).map(
    ([code, name]): IDatabase.EncounterSet => {
      const packEncounterSet = packEncounterSets.find(propEq(code, 'code'));

      if (!packEncounterSet) {
        console.log(`pack for encounter set "${code}" not found`);
        return {
          source: IDatabase.EncounterSetSource.ARKHAM_CARDS,
          code,
          name
        }
      }

      const { 
        size, 
        cycle_code, 
        code: pack_code 
      } = packEncounterSet;

      return {
        pack_code,
        cycle_code,
        is_custom,
        code,
        name,
        size
      }
    });
}