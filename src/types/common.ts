export type Mapping = {
  [string: string]: string
}

export type SingleValue<T extends Array<unknown>> = T[number];