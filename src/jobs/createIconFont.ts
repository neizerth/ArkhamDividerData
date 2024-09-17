import path from 'node:path';
import { FontAssetType, generateFonts, OtherAssetType } from 'fantasticon';
import sax from 'sax';
import fs from 'fs';

import { FONTS_DIR, ICONS_CACHE_DIR, ICONS_EXTRA_DIR } from '@/config/app';
import { IIcoMoon } from '@/types/icomoon';
import * as Cache from '@/util/cache';
import { createJSONReader, createWriter, mkDir } from '@/util/fs';
import { toPairs } from 'ramda';
import { CacheType } from '@/types/cache';
import { Mapping } from '@/types/common';

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

  const data = toPairs(info)
    .map(([icon, code]) => ({
      icon,
      code
    }))

  Cache.cache(CacheType.ICONS_INFO, data);
}

export const extractIcons = async () => {
  const icons = Cache.getIcons();

  const writeSVG = createWriter({
    dir: ICONS_CACHE_DIR, 
    extension: 'svg'
  })

  icons.forEach(icon => {
    const { name } = icon.properties;
    const contents = getIconContents(icon);

    writeSVG(name, contents);
  });
  // const
}

export const getIconContents = ({ icon }: IIcoMoon.Icon) => {
  const size = 1024;
  const height = size;
  const { width = size } = icon;
  const viewBox = `0 0 ${width} ${height}`;

  const paths = icon.paths
    .map(d => `<path d="${d}"/>`)
    .join('');

  return `<svg viewBox="${viewBox}">${paths}</svg>`;
}