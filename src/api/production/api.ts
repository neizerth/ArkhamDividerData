import * as C from "@/config/api";
import * as R from "@/api/request";
import type { ICache } from "@/types/cache";

const getAPIData = R.getWithPrefix(C.PRODUCTION_URL);

console.log(C.PRODUCTION_URL)

export const loadGlyphMap = async () => {
  const { data } = await getAPIData<ICache.FontIconInfo>('fonts/icons.json')

  return data;
}