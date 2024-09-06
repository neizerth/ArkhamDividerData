import { always, identity, ifElse, isEmpty } from "ramda";

export const unique = <T>(data: T[]): T[] => Array.from(new Set(data));

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const strIf = (str: string, condition: boolean, defaultValue = '') => condition ? str : defaultValue