export const whereEquals = <C extends { [index: string]: unknown }>(criteria: C) => <T extends C>(item: T) => 
  Object.entries(criteria).every(([key, value]) => item[key] === value);

export const whereNotEquals = <C extends { [index: string]: unknown }>(criteria: C) => <T extends C>(item: T) => 
  Object.entries(criteria).every(([key, value]) => item[key] !== value);

export const hasPropEquals = <T>(prop: keyof T) => <V>(value: V) => (item: T) => item[prop] === value;

export const hasPropNotEquals = <T>(prop: keyof T) => <V>(value: V) => (item: T) => item[prop] !== value;

export const whereIn = <T, P extends keyof T>(prop: P, data: T[P][]) => (item: T) => data.includes(item[prop])

export const whereNotIn = <T, P extends keyof T>(prop: P, data: T[P][]) => (item: T) => !data.includes(item[prop]);
