export const whereEquals = <C extends { [index: string]: unknown }>(criteria: C) => <T extends C>(item: T) => 
  Object.entries(criteria).every(([key, value]) => item[key] === value);

export const whereNotEquals = <C extends { [index: string]: unknown }>(criteria: C) => <T extends C>(item: T) => 
  Object.entries(criteria).every(([key, value]) => item[key] !== value);

export const hasPropEquals = <T>(prop: keyof T) => <V>(value: V) => (item: T) => item[prop] === value;

export const hasPropNotEquals = <T>(prop: keyof T) => <V>(value: V) => (item: T) => item[prop] !== value;

export const isCustom = ({ 
  is_canonical, 
  is_official 
}: {
  is_canonical: boolean 
  is_official: boolean
}) =>
  !is_canonical || !is_official; 

export const whereSynonyms = (searchCode: string) => ({
  synonyms,
  code
}: {
  code: string
  synonyms: string[]
}) => {
  return code === searchCode || synonyms.includes(searchCode);
}

export const withEncounters = ({
  encounter_sets = [],
  extra_encounter_sets = []
}: {
  encounter_sets?: string[]
  extra_encounter_sets?: string[]
}) => {
  return encounter_sets.length > 0 || extra_encounter_sets.length > 0
}