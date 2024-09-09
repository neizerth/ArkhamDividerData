import { Mapping } from "@/types/common";

export const translateMapping = (from: Mapping, to: Mapping): Mapping => {
  return Object.entries(to)
    .reduce((target, [key, value]) => {
      const isTranslated = value !== from[key];

      if (value && !isTranslated) {
        target[key] = value;
      }

      return target;
    }, {} as Mapping);
}