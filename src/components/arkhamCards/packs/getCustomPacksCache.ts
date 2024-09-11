import { loadJSONPacks } from "@/api/arkhamCards/api"
import { linkCustomPacksEncounterSets } from "@/components/arkhamCards/cycles/linkCustomPacksEncounterSets";

export const getCustomPacksCache = async () => {
  const packsJSON = await loadJSONPacks();
  
  return await linkCustomPacksEncounterSets(packsJSON);
}