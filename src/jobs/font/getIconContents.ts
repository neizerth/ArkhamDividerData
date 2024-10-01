import { IIcoMoon } from "@/types/icomoon";
import getBounds from 'svg-path-bounds'
import { SVGPathData } from 'svg-pathdata';
import { preservePaths, preserveWidth } from '@/data/icons/transformation.json'
import { DEFAULT_ICON_SIZE } from "@/config/icons";

export const getIconContents = async (item: IIcoMoon.Icon) => {

  const preserve = preservePaths.includes(item.properties.name);
  
  const {
    width,
    height,
    paths
  } = preserve ? getDefaultIcon(item) : getTransformedIcon(item)

  const pathContents = paths
    .map(d => `<path d="${d}"/>`)
    .join('');

  const viewBox = `0 0 ${width} ${height}`

  const xmlns = 'http://www.w3.org/2000/svg';

  return `<svg xmlns="${xmlns}" viewBox="${viewBox}" width="${width}" height="${height}">${pathContents}</svg>`;
}


export const getTransformedIcon = ({ icon, properties }: IIcoMoon.Icon) => {

  const rect = getSVGBoundingRect(icon); 
  const { size, width } = rect;
  const preserveIconWidth = preserveWidth.includes(properties.name);

  const paths = icon.paths.map(path => 
    translatePath({
      path,
      rect,
      translateX: !preserveIconWidth
    })
  )

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

export const translatePath = ({
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
  const dX = translateX ? -left + (size - width) / 2 : 0;
  const dY = translateY ? -top + (size - height) / 2 : 0;
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