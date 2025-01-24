import type { Mapping } from "@/types/common";
import { toPairs } from "ramda";

export const toTranslationBundle = (mapping: Mapping) => {
  return toPairs(mapping)
    .reduce((target, [sourceKey, sourceValue]) => {
      const key = toI18Next(sourceKey);
      const value = toI18Next(sourceValue);
      target[key] = value;
      return target;
    }, {} as Mapping)
} 

export const toI18Next = (text: string) => text
  .replace(/\$\{ /g, '{{')
  .replace(/ }/g, '}}')
  .replace(/[\[\]]/g, '')