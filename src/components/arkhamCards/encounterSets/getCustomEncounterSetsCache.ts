import { loadJSONEncounterSets } from "@/api/arkhamCards/api"
import { getCustomPacksFromCache } from "@/util/cache";
import { identity, prop, propEq } from "ramda";

export const getCustomEncountersSetCache = async () => {
  const arkhamCardsSets = await loadJSONEncounterSets();
  const customPacks = getCustomPacksFromCache();

  const encounterSets = customPacks.map(prop('encounter_sets')).flat();

  return arkhamCardsSets.map(encounter => {
    const encounterSet = encounterSets.find(propEq(encounter.code, 'code'));
    if (!encounterSet) {
      return false;
    }
    return {
      ...encounter,
      ...encounterSet
    }
  })
  .filter(identity);
}
