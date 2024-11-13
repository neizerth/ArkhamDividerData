import path from 'node:path';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';
import sax from 'sax';
import fs from 'fs';

import { FONTS_DIR, ICONS_CACHE_DIR, ICONS_EXTRA_DIR } from '@/config/app';
import * as Cache from '@/util/cache';
import { createExistsChecker, createJSONReader, createWriter, mkDir } from '@/util/fs';
import { isNotNil, prop, toPairs } from 'ramda';
import { CacheType } from '@/types/cache';
import { Mapping } from '@/types/common';
import { DEFAULT_ICON_SIZE } from '@/config/icons';
import { getIconContents } from './font/getIconContents';
import { customContent } from '@/data/customContent';

// @ts-ignore
sax.MAX_BUFFER_LENGTH = Infinity;

export const createIconFont = async () => {
  console.log('extracting svg icons...');
  await extractIcons();
  console.log('copying extra icons...');
  await copyExtraIcons();
  console.log('creating font assets...');
  await createAssets();
}

export const copyExtraIcons = async () => {
  fs.cpSync(
    ICONS_EXTRA_DIR, 
    ICONS_CACHE_DIR,
    { recursive: true }
  );

  const customDirs = Object.values(customContent)
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
      OtherAssetType.JSON
    ]
  });

  await cacheIconsInfo();

  const infoFilename = path.resolve(FONTS_DIR + '/icons.json');
  fs.unlinkSync(infoFilename);
}

export const cacheIconsInfo = async () => {
  const readJSON = createJSONReader(FONTS_DIR);
  const info = readJSON<Mapping<number>>('icons');
  const icons = Cache.getIcons();

  const data = toPairs(info)
    .map(([icon, code]) => {
      const dbIcon = icons.find(
        ({ properties }) => properties.name === icon
      )

      if (!dbIcon) {
        return {
          icon,
          code
        }
      }

      const { width = DEFAULT_ICON_SIZE } = dbIcon.icon;
      const ratio = width / DEFAULT_ICON_SIZE;
      const iconSet = dbIcon.properties.iconSetName;

      return {
        icon,
        ratio,
        iconSet,
        code
      }
    })
    .filter(isNotNil);

  Cache.cache(CacheType.ICONS_INFO, data);
}

export const extractIcons = async () => {
  const icons = Cache.getIcons();
  const encounterIcons = Cache.getDatabaseEncounterSets()
    .map(prop('icon'))
    .filter(isNotNil)

  const options = {
    dir: ICONS_CACHE_DIR, 
    extension: 'svg'
  }
  const writeSVG = createWriter(options)

  const exists = createExistsChecker(options);

  for (const icon of icons) {
    const { name, iconSetName } = icon.properties;
    const contents = await getIconContents(icon, encounterIcons);

    if (!exists(name)) {
      writeSVG(name, contents);
      continue;
    }
    const iconSetId = iconSetName.toLowerCase().replace(/\W/g, '');
    const uniqueName = `${iconSetId}-${name}`;

    writeSVG(uniqueName, contents);
  }
  // const
}