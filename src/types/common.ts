export type Mapping<T = string> = {
  [string: string]: T
}

export type SingleValue<T extends Array<unknown>> = T[number];