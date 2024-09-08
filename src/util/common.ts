export const unique = <T>(data: T[]): T[] => Array.from(new Set(data));

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));