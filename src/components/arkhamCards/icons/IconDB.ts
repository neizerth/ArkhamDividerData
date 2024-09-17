import { Mapping } from "@/types/common";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import { showError } from "@/util/console";

import storyIcons from '@/data/icons/stories.json';
import { propEq } from "ramda";

export type IconDBOptions = {
  icons: string[]
  iconMapping: Mapping
  returnId?: boolean
  type?: IconDBType
}

export type IIconDB<T = string | undefined> = {
  getIcon(id: string, defaultValue?: string): T
  getIconOf(ids: (string | undefined)[], defaultValue?: string): T
}

export class IconDB<T = string | undefined> implements IIconDB<T> {
  icons: string[];
  iconMapping: Mapping
  returnId: boolean
  type: IconDBType;

  constructor({ 
    icons, 
    iconMapping, 
    returnId = false,
    type = IconDBType.COMMON
  }: IconDBOptions) {
    this.icons = icons;
    this.iconMapping = iconMapping;
    this.returnId = returnId;
    this.type = type;
    
    this.getIcon = this.getIcon.bind(this);
  }
  getIconOf(ids: (string | undefined)[], defaultValue?: string): T {
    for (const id of ids) {
      const icon = this.getSingle(id, defaultValue);
      if (icon) {
        const check = this.postCheck(icon as string);
        if (check) {
          return icon;
        }
      }
    }
    return defaultValue as T;
  }
  getIcon(id?: string, defaultValue?: string): T {
    const icon = this.getSingle(id);
    if (!icon) {
      return defaultValue as T;
    }
    return this.postCheck(icon as string, defaultValue) as T; 
  }
  postCheck(id: string, defaultValue?: string): T {
    if (!this.icons.includes(id)) {
      return defaultValue as T;
    }
    return id as T;
  }

  getSingle(id?: string, defaultValue?: string): T {
    if (!id) {
      return defaultValue as T;
    }

    if (this.type === IconDBType.STORY) {
      const icon = storyIcons.find(propEq(id, 'code'))?.icon;
      if (icon) {
        return icon as T;
      }
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

export const createIconDB = (type?: IconDBType) => {
  const iconMapping = Cache.getIconMapping();
  const project = Cache.getIcons();
  const icons = project.map(({ properties }) => properties.name);

  return new IconDB({
    iconMapping,
    icons,
    type
  });
}