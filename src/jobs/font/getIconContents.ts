import { IIcoMoon } from "@/types/icomoon";
import getBounds from 'svg-path-bounds'
import { preservePaths, preserveWidth } from '@/data/icons/transformation.json'
import { DEFAULT_ICON_SIZE } from "@/config/icons";

import { SVGPathData } from 'svg-pathdata';

export const getIconContents = async (item: IIcoMoon.Icon, encounterIcons: string[]) => {
  const icon = item.properties.name;
  const preserve = preservePaths.includes(icon);

  const isEncounter = encounterIcons.includes(icon);
  
  const {
    width,
    height,
    paths
  } = preserve ? getDefaultIcon(item) : await getTransformedIcon(item, isEncounter)

  const pathContents = paths
    .map(d => `<path d="${d}"/>`)
    .join('');

  const viewBox = `0 0 ${width} ${height}`

  const xmlns = 'http://www.w3.org/2000/svg';

  return `<svg xmlns="${xmlns}" viewBox="${viewBox}" width="${width}" height="${height}">${pathContents}</svg>`;
}


export const getTransformedIcon = async (
  { icon, properties }: IIcoMoon.Icon,
  isEncounter = false
) => {

  const rect = getSVGBoundingRect(icon); 
  const { size, width } = rect;
  const preserveIconWidth = isEncounter || preserveWidth.includes(properties.name);

  const paths = [];

  for (const path of icon.paths) {
    const item = await translatePath({
      path,
      rect,
      translateX: !preserveIconWidth
    })

    paths.push(item);
  }

  return {
    width: preserveIconWidth ? width : size,
    height: size,
    paths
  }
}

export const getDefaultIcon = ({ icon }: IIcoMoon.Icon) => {
  const height = DEFAULT_ICON_SIZE;
  const { 
    width = DEFAULT_ICON_SIZE, 
    paths 
  } = icon;

  return {
    width,
    height,
    paths
  }
}

export const translatePath = async ({
  path,
  rect,
  translateX = true,
  translateY = true
}: {
  path: string
  rect: ISVGBoundingRect
  translateX?: boolean
  translateY?: boolean
}) => {
  const { 
    top, 
    left,
    width,
    height,
    size
  } = rect;

  const pathData = new SVGPathData(path);
  const dX = translateX ? -left + (size - width) / 2 : -left;
  const dY = translateY ? -top + (size - height) / 2 : -top;
  pathData.translate(dX, dY);

  return pathData.encode();
}

type ISVGBoundingRect = {
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
  size: number
}

export const getSVGBoundingRect = ({ paths }: IIcoMoon.IconSetItem): ISVGBoundingRect => {
  const viewBox = paths.reduce((target, d) => {
    const [left, top, right, bottom] = getBounds(d);

    return {
      top: Math.min(target.top, top),
      left: Math.min(target.left, left),
      right: Math.max(target.right, right),
      bottom: Math.max(target.bottom, bottom)
    };
  }, {
    top: Infinity,
    left: Infinity,
    right: -Infinity,
    bottom: -Infinity
  });
  const width = viewBox.right - viewBox.left;
  const height = viewBox.bottom - viewBox.top;
  const size = Math.max(width, height);
  return {
    ...viewBox,
    width,
    height,
    size
  }
}