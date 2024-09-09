import { loadIconsPatch } from "@/api/arkhamCards/api";
import { Mapping } from "@/types/common";

export const getIconsMappingCache = async () => {
  const contents = await loadIconsPatch();

  return parsePatchContents(contents);
}

export const PATCH_EXPRESSION = /(\s*case '(.*)':\s*\n)+\s*return this\.[^(]+\('(.*)'/gm;
export const PATCH_ENCOUNTER_SET_EXPRESSION = /(case '(.*)':)/gm;

export const parsePatchContents = (patchContents: string): Mapping => {
  const matches = patchContents.matchAll(PATCH_EXPRESSION);

  const map = {} as Mapping;
  const patch = Array.from(matches)
    .map(mapMatch);

  patch.forEach(({ tags, name }) => 
    tags.forEach(tag => 
      map[tag] = name
    )
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