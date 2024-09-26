import path from 'node:path';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';
import sax from 'sax';
import fs from 'fs';

import { FONTS_DIR, ICONS_CACHE_DIR, ICONS_EXTRA_DIR } from '@/config/app';
import * as Cache from '@/util/cache';
import { createJSONReader, createWriter, mkDir } from '@/util/fs';
import { isNotNil, toPairs } from 'ramda';
import { CacheType } from '@/types/cache';
import { Mapping } from '@/types/common';
import { DEFAULT_ICON_SIZE } from '@/config/icons';
import { getIconContents } from './font/getIconContents';

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

      return {
        icon,
        ratio,
        code
      }
    })
    .filter(isNotNil);

  Cache.cache(CacheType.ICONS_INFO, data);
}

export const extractIcons = async () => {
  const icons = Cache.getIcons();

  const writeSVG = createWriter({
    dir: ICONS_CACHE_DIR, 
    extension: 'svg'
  })

  for (const icon of icons) {
    const { name } = icon.properties;
    const contents = await getIconContents(icon);

    writeSVG(name, contents);
  }
  // const
}