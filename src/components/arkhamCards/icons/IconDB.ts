import type { Mapping } from "@/types/common";
import { IconDBType } from "@/types/icons";
import * as Cache from "@/util/cache";
import { showError, showSuccess, showWarning } from "@/util/console";

import storyIcons from '@/data/icons/stories.json';
import temporaryIcons from '@/data/icons/temporary.json';
import specialIcons from '@/data/icons/special.json';

import { propEq } from "ramda";

const ARKHAM_CARDS_CUSTOM_PREFIXES = [
  'z',
];

const CUSTOM_PATTERN = /^z[^_]+_(.*)$/; 

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

    if (specialIcons.find(propEq(id, 'icon'))) {
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

    if (CUSTOM_PATTERN.test(id)) {
      const customId = id.replace(CUSTOM_PATTERN, '$1');
      // console.log('custom icon', customId)
      return this.getIcon(
        customId, 
        defaultValue
      );
    }

    const prefix = ARKHAM_CARDS_CUSTOM_PREFIXES.find(
      prefix => id.startsWith(prefix)
    );

    if (prefix) {
      return this.getIcon(
        id.slice(prefix.length), 
        defaultValue
      );
    }

    const starts = this.icons.filter(
      icon => icon.startsWith(id)
    );

    if (starts.length === 1) {
      showWarning(`not exact search for id ${id} -> ${starts[0]}`)
      return starts[0];
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