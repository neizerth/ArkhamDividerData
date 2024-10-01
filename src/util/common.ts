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