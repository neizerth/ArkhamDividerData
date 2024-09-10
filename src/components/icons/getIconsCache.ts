import { getIconsInfo } from "./getIcoMoonIcons";
import { loadIcons } from "@/api/arkhamCards/api";

export const getIconsCache = async () => {
  const project = await loadIcons(); 
  return getIconsInfo(project);
}