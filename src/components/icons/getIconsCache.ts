import { prop } from "ramda";
import { getIconsInfo } from "./getIcoMoonIcons";
import { loadIcons } from "@/api/arkhamCards/api";

export const getIconsCache = async () => {
  const project = await loadIcons(); 
  const names = getIconsInfo(project)
    .map(prop('name'));
    
  return {
    names,
    project
  }
}