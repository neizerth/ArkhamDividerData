import { Mapping } from "@/types/common";
import * as Cache from "@/util/cache";
import { showError } from "@/util/console";

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
    
    this.getIcon = this.getIcon.bind(this);
  }
  getIconOf(ids: string[], defaultValue?: string) {
    for (const id of ids) {
      const icon = this.getIcon(id, defaultValue);
      if (icon) {
        return icon;
      }
    }
    return defaultValue;
  }
  getIcon(id: string, defaultValue?: string): T {
    if (!id) {
      showError(`icon for encounter code "${id}" not found`);

      return defaultValue as T;
    }

    if (this.icons.includes(id)) {
      return id as T;
    }
    
    const icon = this.iconMapping[id];
    if (icon) {
      return icon as T;
    }
    
    showError(`icon for encounter code "${id}" not found`);
    
    const returnId = this.returnId ? id : defaultValue;
    return returnId as T;
  }
}

export const createIconDB = () => {
  const iconMapping = Cache.getIconMapping();
  const project = Cache.getIconProject();
  const icons = project.map(({ properties }) => properties.name);

  return new IconDB({
    iconMapping,
    icons
  });
}