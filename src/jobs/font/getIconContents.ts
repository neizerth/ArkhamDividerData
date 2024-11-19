import { IIcoMoon } from "@/types/icomoon";
import { preservePaths, preserveWidth } from '@/data/icons/transformation.json'
import { DEFAULT_ICON_SIZE } from "@/config/icons";

import { 
  SVGPathData, 
} from 'svg-pathdata';
import sharp from "sharp";

export const getIconContents = async (item: IIcoMoon.Icon) => {
  const icon = item.properties.name;
  const preserve = preservePaths.includes(icon);
  
  const {
    width,
    height,
    paths
  } = preserve ? getDefaultIcon(item) : await getCroppedIcon(item)

  const svg = getSVG({
    paths,
    width,
    height
  });
  
  return {
    svg,
    width,
    height
  }
}

export const getSVG = ({
  width,
  height,
  paths
}: {
  width: number,
  height: number,
  paths: string[]
}) => {
  const pathContents = paths
    .map(d => `<path d="${d}"/>`)
    .join('');

  const viewBox = `0 0 ${width} ${height}`

  const xmlns = 'http://www.w3.org/2000/svg';

  const attrs = `xmlns="${xmlns}" viewBox="${viewBox}" width="${width}" height="${height}"`;
  return `<svg ${attrs}>${pathContents}</svg>`;
}

export const getCroppedIcon = async (item: IIcoMoon.Icon) => {
  const { name } = item.properties;
  console.log(`processing icon: ${name}`);

  const rect = await getSVGBoundingRect(item);
  const { width, height } = rect;

  const paths = [];

  for (const path of item.icon.paths) {
    const item = await translatePath({
      path,
      rect,
    })

    paths.push(item);
  }

  return {
    width,
    height,
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
  left: number
  width: number
  height: number
  size: number
}

export const getSVGBoundingRect = async ({ icon }: IIcoMoon.Icon): Promise<ISVGBoundingRect> => {
  const { 
    paths, 
    width = DEFAULT_ICON_SIZE 
  } = icon;
  const height = DEFAULT_ICON_SIZE;
  const svg = getSVG({
    width,
    height, 
    paths 
  });

  const buffer = Buffer.from(svg);
  const img = await sharp(buffer)
    .trim();

  const { info } = await img.toBuffer({
    resolveWithObject: true
  });

  const { 
    trimOffsetLeft = 0, 
    trimOffsetTop = 0,
  } = info;

  const size = Math.max(info.width, info.height);

  return {
    top: -trimOffsetTop,
    left: -trimOffsetLeft,
    width: info.width,
    height: info.height,
    size
  }
}