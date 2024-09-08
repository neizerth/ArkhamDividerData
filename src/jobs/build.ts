import { buildFromCache } from "./buildFromCache";
import { createCache } from "./createCache"

export const build = async () => {
  await createCache();
  await buildFromCache();
}