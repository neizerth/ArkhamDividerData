import { whereSynonyms } from "@/util/criteria"
import iconIgnoreList from "@/data/icons/synonymignore.json";
import { always } from "ramda";


export const withIconSynonyms = (code: string) => {
  if (iconIgnoreList.includes(code)) {
    return always(false);
  }
  return whereSynonyms(code)
}

export const isIconIgnored = (code: string) => iconIgnoreList.includes(code);