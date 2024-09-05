import { loadIcons } from '@/api/arkhamCards';
import { 
  IIcoMoonProject, 
  IIcoMoonIconSet,
  IIcoMoonIconSetItem,
  IIcoMoonIcon,
} from '@/types/icomoon'

export const getIcoMoonIcons = async () => {
  const project: IIcoMoonProject = await loadIcons();
  return getIconsInfo(project);
}


export const getIconsInfo = ({ iconSets }: IIcoMoonProject): IIcoMoonIcon[] => 
  iconSets.map(mapIconSet)
  .flat()

const addIconName = ({ metadata, selection }: IIcoMoonIconSet) => {
  const campaign = metadata.name;

  const iconMap = new Map<number, string>();
  selection.forEach((item) => iconMap.set(item.id, item.name));

  return (icon: IIcoMoonIconSetItem): IIcoMoonIcon => {
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

const mapIconSet = (iconSet: IIcoMoonIconSet) => iconSet.icons.map(addIconName(iconSet));

// const mapIconSet = (iconSet: IIcoMoonIconSet) => iconSet.icons.map(addIconName);