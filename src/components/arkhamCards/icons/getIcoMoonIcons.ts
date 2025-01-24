import { loadIcons } from '@/api/arkhamCards/api';
import type { IIcoMoon } from '@/types/icomoon'

export const getIcoMoonIcons = async () => {
  const project = await loadIcons();
  return getIconsInfo(project);
}

export const getIconsInfo = ({ iconSets }: IIcoMoon.Project): IIcoMoon.Icon[] => iconSets.flatMap(mapIconSet)

const addIconName = ({ selection, metadata }: IIcoMoon.IconSet) => {
  const iconMap = new Map<number, string>();
  const iconSetName = metadata.name;
  selection.forEach((item) => iconMap.set(item.id, item.name));

  return (icon: IIcoMoon.IconSetItem): IIcoMoon.Icon => {
    let [name] = icon.tags;
    const tagName = iconMap.get(icon.id);

    if (tagName && name !== tagName) {
      name = tagName;
    }
    
    return {
      properties: {
        name,
        iconSetName,
      },
      icon,
    }
  }
}

const mapIconSet = (iconSet: IIcoMoon.IconSet) => iconSet.icons.map(addIconName(iconSet));

// const mapIconSet = (iconSet: IIcoMoonIconSet) => iconSet.icons.map(addIconName);