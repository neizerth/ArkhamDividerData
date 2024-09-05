import { ARKHAM_DB_BASE_URL } from "@/config/api";
import { getWithPrefix } from "./request";

const getData = getWithPrefix(ARKHAM_DB_BASE_URL);

export const getPacks = async () => {
  const { data } = await getData('/packs');
  return data;
}