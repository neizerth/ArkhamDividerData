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

const CH2_CODE_SUFFIX = "_ch2";

/** Drop redundant / disallowed synonym entries for encounter set `code`. */
export const sanitizeEncounterSynonyms = (
  code: string,
  synonyms: string[],
): string[] => {
  const baseIfCh2 = code.endsWith(CH2_CODE_SUFFIX)
    ? code.slice(0, -CH2_CODE_SUFFIX.length)
    : null;
  return synonyms.filter(
    (s) => s !== code && (baseIfCh2 === null || s !== baseIfCh2),
  );
};

export const isNumeric = (value: string): boolean => !Number.isNaN(+value);

export const onlyWords = (text: string) => text.replace(/[^\w ]/g, '');

export const createPropTranslator = <K extends keyof T, T extends { [index: string]: string }>(source: T, translation: T) => 
  (props: K[]) => {
    const mappings = props.map(prop => {
      if (!source[prop]) {
        return {}
      }
      if (!translation[prop]) {
        return {}
      }
      if (source[prop] === translation[prop]) {
        return {}
      }
      return {
        [source[prop]]: translation[prop]
      }
    });

    return Object.assign({}, ...mappings);
  }

export const definedIf = <T>(getValue: () => T, getCondition: () => boolean) => {
  if (getCondition()) {
    return getValue();
  }
  return;
}

export const prefix = (prefix: string) => (msg: string) => `${prefix}${msg}`;

export const toArrayIf = <T>(condition: boolean, item: T) => condition ? [item] : [];