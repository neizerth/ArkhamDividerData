import { Mapping } from "@/types/common";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import { showError } from "@/util/console";

import storyIcons from '@/data/icons/stories.json';
import temporaryIcons from '@/data/icons/temporary.json';
import specialIcons from '@/data/icons/special.json';

import { propEq } from "ramda";

export type IconDBOptions = {
  icons: string[]
  iconMapping: Mapping
  returnId?: boolean
  type?: IconDBType
}

export type IIconDB = {
  getIcon(id: string, defaultValue?: string): string | undefined
  getIconOf(ids: (string | undefined)[], defaultValue?: string): string | undefined
}

export class IconDB implements IIconDB {
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
  getIconOf(ids: (string | undefined)[], defaultValue?: string): string | undefined {
    for (const id of ids) {
      const icon = this.getIcon(id, defaultValue);
      if (icon) {
        return icon;
      }
    }
    return defaultValue;
  }

  getIcon(id?: string, defaultValue?: string): string | undefined {
    if (!id) {
      return defaultValue;
    }

    if (specialIcons.includes(id)) {
      return id;
    }

    if (this.type === IconDBType.STORY) {
      const icon = storyIcons.find(propEq(id, 'code'))?.icon;
      if (icon) {
        return icon;
      }
    }

    const icon = this.iconMapping[id];
    if (icon) {
      return icon;
    }

    if (this.icons.includes(id)) {
      return id;
    }

    const temporaryIcon = temporaryIcons.find(propEq(id, 'code'))?.icon;
    if (temporaryIcon) {
      return temporaryIcon;
    }

    if (id[0] !== 'z') {
      return this.getIcon('z' + id, defaultValue);
    }
    
    showError(`icon for encounter code "${id}" not found`);
    
    const returnId = this.returnId ? id : defaultValue;
    return returnId;
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