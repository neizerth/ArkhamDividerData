import { IIcoMoon } from "@/types/icomoon";
import getBounds from 'svg-path-bounds'
import { SVGPathData } from 'svg-pathdata';

export const getIconContents = async ({ icon }: IIcoMoon.Icon) => {

  const rect = getSVGBoundingRect(icon); 

  const { 
    size
  } = rect;

  const pathContents = icon.paths
    .map(d => `<path d="${translatePath(d, rect)}"/>`)
    .join('');

  const viewBox = `0 0 ${size} ${size}`

  const xmlns = 'http://www.w3.org/2000/svg';

  const svg = `<svg xmlns="${xmlns}" viewBox="${viewBox}" width="${size}" height="${size}">${pathContents}</svg>`;
  return svg;
}

export const translatePath = (path: string, rect: ISVGBoundingRect) => {
  const { 
    top, 
    left,
    width,
    height,
    size
  } = rect;
  const pathData = new SVGPathData(path);
  const dX = -left + (size - width) / 2;
  const dY = -top + (size - height) / 2;
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