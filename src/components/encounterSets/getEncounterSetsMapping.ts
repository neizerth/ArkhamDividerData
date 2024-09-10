import { IArkhamCards } from "@/types/arkhamCards";
import { Mapping } from "@/types/common";

export const getEncounterSetsMapping = (data: IArkhamCards.EncounterSet[]) => {
  return data.reduce(
    (target, { name, code }) => {
      target[code] = name;
      return target;
    }, 
    {} as Mapping
  );
}