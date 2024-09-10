import { Mapping } from "@/types/common";
import { getIconMappingFromCache, getIconNamessFromCache } from "@/util/cache";

export type IconDBOptions = {
  icons: string[]
  iconMapping: Mapping
  returnId?: boolean
}

export type IIconDB<T = string | undefined> = {
  getId(id: string, defaultValue?: string): T
}

export class IconDB<T = string | undefined> {
  icons: string[];
  iconMapping: Mapping
  returnId: boolean

  constructor({ 
    icons, 
    iconMapping, 
    returnId = false
  }: IconDBOptions) {
    this.icons = icons;
    this.iconMapping = iconMapping;
    this.returnId = returnId;
    
    this.getId = this.getId.bind(this);
  }
  getId(id: string, defaultValue?: string): T {
    if (!id) {
      return undefined as T;
    }
    if (this.icons.includes(id)) {
      return id as T;
    }
    
    const icon = this.iconMapping[id];
    if (icon) {
      return icon as T;
    }
    
    console.log(`encounter code "${id}" not found`);
    const returnId = this.returnId ? id : defaultValue;
    return returnId as T;
  }
}

export const createIconDB = () => {
  const iconMapping = getIconMappingFromCache();
  const icons = getIconNamessFromCache();

  return new IconDB({
    iconMapping,
    icons
  });
}