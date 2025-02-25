import { loadIconsPatch } from "@/api/arkhamCards/api";
import * as Cache from '@/util/cache';
import type { Mapping } from "@/types/common";
import { fromPairs, toPairs } from "ramda";
import { showWarning } from "@/util/console";

export const getIconsMapping = async () => {
  const contents = await loadIconsPatch();

  const mapping = parsePatchContents(contents);

  return removeMissingIcons(mapping);
}

export const PATCH_EXPRESSION = /(\s*case '(.*)':[^\n ]*)+\s*return this\.[^(]+\('(.*)'/gm;
export const PATCH_ENCOUNTER_SET_EXPRESSION = /(case '(.*)':)/gm;

export const removeMissingIcons = (mapping: Mapping): Mapping => {
  const icons = Cache.getIcons()
    .map(({ properties }) => properties.name);
  const pairs = toPairs(mapping)
    .filter(([_, name]) => {
      if (!icons.includes(name)) {
        showWarning(`removed missing icon from mapping: ${name}`)
        return false;
      }
      return true;
    });
  
  return fromPairs(pairs);
}

export const parsePatchContents = (patchContents: string): Mapping => {
  const matches = patchContents.matchAll(PATCH_EXPRESSION);

  const map = {} as Mapping;
  const patch = Array.from(matches)
    .map(mapMatch);

  patch.forEach(({ tags, name }) => 
    tags.forEach(tag => {
      if (tag === name) {
        return;
      }
      map[tag] = name
    })
  );

  return map;
}

export const mapMatch = ([contents, ...rest]: RegExpMatchArray) => {
  const name = rest[rest.length - 1];
  const matches = contents.matchAll(PATCH_ENCOUNTER_SET_EXPRESSION);
  const tags = Array.from(matches)
    .map(m => m[2]);

  return {
    tags,
    name
  };
}