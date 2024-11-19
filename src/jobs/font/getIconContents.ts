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
  const { name } = properties;
  const rect = getSVGBoundingRect(icon.paths); 

  const preserveIconWidth = preserveWidth.includes(name);

  const paths = [];

  for (const path of icon.paths) {
    const item = await translatePath({
      path,
      rect,
    })

    paths.push(item);
  }

  const { 
    width,
    height,
    left,
    right
  } = getSVGBoundingRect(paths, name === 'alice_in_arkham');

  if (name === 'alice_in_arkham') {
    // console.log(rect);
    console.log({
      left,
      right,
      width,
      height
    })
  }

  return {
    width: preserveIconWidth ? width : width,
    height: height,
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
}: {
  path: string
  rect: ISVGBoundingRect
}) => {
  const { 
    top, 
    left,
  } = rect;

  const pathData = new SVGPathData(path);
  const dX = -left;
  const dY = -top;
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

export const getSVGBoundingRect = (paths: string[], verbose = false): ISVGBoundingRect => {
  const viewBox = paths.reduce((target, d) => {
    const [left, top, right, bottom] = getBounds(d);
    if (verbose) {
      console.log(d, left)
    }

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
    // left: Math.max(0, viewBox.left),
    // right: Math.min(width, viewBox.right),
    // top: Math.max(0, viewBox.top),
    // bottom: Math.min(height, viewBox.bottom),
    width,
    height,
    size
  }
}