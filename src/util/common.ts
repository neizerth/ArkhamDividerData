import { complement, propEq } from "ramda";

export const unique = <T>(data: T[]): T[] => Array.from(new Set(data));

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const toSynonyms = ({
  synonyms,
  code
}: {
  code: string
  synonyms: string[]
}) => {
  return [code, ...synonyms];
}

export const onlyWords = (text: string) => text.replace(/[^\w ]/g, '');