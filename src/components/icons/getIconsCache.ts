import { prop } from "ramda";
import { getIcoMoonIcons } from "./getIcoMoonIcons";

export const getIconsCache = async () => {
  const project = await getIcoMoonIcons();
  return project.map(prop('name'));
}