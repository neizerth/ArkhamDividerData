import { loadIcons } from '../../api/arkhamCards/api';
import { IIcoMoon } from '../../types/icomoon'

export const getIcoMoonIcons = async () => {
  const project = await loadIcons();
  return getIconsInfo(project);
}

export const getIconsInfo = ({ iconSets }: IIcoMoon.Project): IIcoMoon.Icon[] => 
  iconSets.map(mapIconSet)
  .flat()

const addIconName = ({ metadata, selection }: IIcoMoon.IconSet) => {
  const campaign = metadata.name;

  const iconMap = new Map<number, string>();
  selection.forEach((item) => iconMap.set(item.id, item.name));

  return (icon: IIcoMoon.IconSetItem): IIcoMoon.Icon => {
    let [name] = icon.tags;
    const tagName = iconMap.get(icon.id);

    if (tagName && name !== tagName) {
      name = tagName;
    }
    
    return {
      campaign,
      name,
    }
  }
}

const mapIconSet = (iconSet: IIcoMoon.IconSet) => iconSet.icons.map(addIconName(iconSet));

// const mapIconSet = (iconSet: IIcoMoonIconSet) => iconSet.icons.map(addIconName);