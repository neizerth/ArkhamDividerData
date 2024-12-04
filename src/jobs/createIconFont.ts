import path from 'node:path';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';
import sax from 'sax';
import fs from 'fs';

import { FONT_ICONS_DIR, FONTS_DIR, ICONS_CACHE_DIR, ICONS_EXTRA_DIR } from '@/config/app';
import * as Cache from '@/util/cache';
import { createExistsChecker, createJSONReader, createWriter, mkDir } from '@/util/fs';
import { isNotNil, prop, propEq, toPairs } from 'ramda';
import { CacheType, ICache } from '@/types/cache';
import { Mapping } from '@/types/common';
import { DEFAULT_ICON_SIZE } from '@/config/icons';
import { getIconContents } from './font/getIconContents';
import { getCustomContent } from '@/components/custom/getCustomContent';
import specialIcons from '@/data/icons/special.json';

// @ts-ignore
sax.MAX_BUFFER_LENGTH = Infinity;

export const prepareIcons = async () => {
  console.log('clearing icons cache...');
  await clearIconsCache();
  console.log('extracting svg icons...');
  await extractIcons();
}

export const createIconFont = async () => {
  await prepareIcons();
  console.log('copying extra icons...');
  await copyExtraIcons();
  console.log('creating font assets...');
  await createAssets();
}

export const clearIconsCache = async () => {
  fs.rmSync(ICONS_CACHE_DIR, { 
    recursive: true, force: true 
  });

}

export const copyExtraIcons = async () => {
  fs.cpSync(
    ICONS_EXTRA_DIR, 
    ICONS_CACHE_DIR,
    { recursive: true }
  );

  const customDirs = getCustomContent()
    .map(prop('iconsDir'))
    .filter(isNotNil);
  
  for (const dir of customDirs) {
    fs.cpSync(
      dir, 
      ICONS_CACHE_DIR,
      { recursive: true }
    );
  }
}

export const createAssets = async () => {
  mkDir(FONTS_DIR);

  await generateFonts({
    name: 'icons',
    inputDir: ICONS_CACHE_DIR,
    outputDir: FONTS_DIR,
    normalize: true,
    fontTypes: [
      FontAssetType.WOFF,
      FontAssetType.WOFF2
    ],
    assetTypes: [
      OtherAssetType.JSON,
      // OtherAssetType.HTML,
      // OtherAssetType.CSS
    ]
  });

  mkDir(FONT_ICONS_DIR);

  fs.cpSync(ICONS_CACHE_DIR, FONT_ICONS_DIR, {
    recursive: true
  });

  await cacheIconsInfo();
}

export const cacheIconsInfo = async () => {
  const readJSON = createJSONReader(FONTS_DIR);
  const info = readJSON<Mapping<number>>('icons');
  const icons = Cache.getIcons();
  const svgIconsInfo = Cache.getSVGIconInfo();

  const customIcons = getCustomContent()
    .map(prop('icons'))
    .filter(isNotNil)
    .flat()
    .concat(specialIcons);

  const findIconInfo = ({
    icon,
    id = icon,
    iconSet
  }: {
    id?: string
    icon: string
    iconSet?: string
  }) => {
    const code = info[id];

    const dbIcon = icons.find(
      ({ properties }) => properties.name === icon && 
        (!iconSet || iconSet === getIconSetId(properties.iconSetName))
    )
    
    const svgIconInfo = svgIconsInfo.find(propEq(id, 'icon')); 

    if (dbIcon && svgIconInfo) {
      const { 
        width,
        height,
        ratio = width / height,
        circled
      } = svgIconInfo;
      const iconSet = dbIcon.properties.iconSetName;

      return {
        icon: id,
        ratio,
        iconSet,
        width,
        height,
        code,
        circled
      }
    }
  }

  const data = toPairs(info)
    .map(([icon, code]) => {
      const item = findIconInfo({
        icon
      });

      if (item) {
        return item;
      }

      const customIcon = customIcons.find(propEq(icon, 'icon'));

      if (customIcon) {
        const { width, height, circled } = customIcon;
        const ratio = width / height;

        return {
          icon,
          code,
          circled,
          width,
          height,
          ratio
        }
      }

      const dashIndex = icon.indexOf('-');
      
      const dashItem = findIconInfo({
        id: icon,
        icon: icon.slice(dashIndex + 1),
        iconSet: icon.slice(0, dashIndex)
      });

      if (dashItem) {
        return dashItem;
      }
      

      console.log(`icon ${icon} not found`);

      return;
    })
    .filter(isNotNil);

  Cache.cache(CacheType.ICONS_INFO, data);
}

export const getIconSetId = (id: string) => id.toLowerCase().replace(/\W/g, '')

export const extractIcons = async () => {
  // const icons = Cache.getIcons().slice(0, 20);
  const icons = Cache.getIcons();
  const iconInfo: ICache.SVGIconInfo[] = [];

  const options = {
    dir: ICONS_CACHE_DIR, 
    extension: 'svg'
  }
  const writeSVG = createWriter(options)

  const exists = createExistsChecker(options);

  for (const icon of icons) {
    const { name, iconSetName } = icon.properties;

    const { 
      svg, 
      width, 
      height, 
      circled 
    } = await getIconContents(icon);

    const ratio = width / height;

    iconInfo.push({
      icon: name,
      ratio,
      circled,
      width,
      height
    });

    if (!exists(name)) {
      writeSVG(name, svg);
      continue;
    }

    const iconSetId = getIconSetId(iconSetName);
    const uniqueName = `${iconSetId}-${name}`;

    iconInfo.push({
      icon: uniqueName,
      ratio,
      circled,
      width,
      height
    });

    writeSVG(uniqueName, svg);
  }

  Cache.cache(CacheType.SVG_ICONS_INFO, iconInfo);
  // const
}