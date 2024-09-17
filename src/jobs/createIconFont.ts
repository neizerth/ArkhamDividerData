import svgtofont, { IconInfo } from 'svgtofont';

import path from 'node:path';
import sax from 'sax';
import fs from 'fs';

import { FONTS_DIR, ICONS_CACHE_DIR, ICONS_EXTRA_DIR } from '@/config/app';
import { IIcoMoon } from '@/types/icomoon';
import * as Cache from '@/util/cache';
import { createJSONReader, createWriter } from '@/util/fs';
import { omit, toPairs } from 'ramda';
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
  const options = {
    src: ICONS_CACHE_DIR,
    dist: FONTS_DIR,
    fontName: 'icons',
    css: false,
    generateInfoData: true
  };

  await svgtofont(options);

  await cacheIconsInfo();

  const infoFilename = path.resolve(FONTS_DIR + '/info.json');
  fs.unlinkSync(infoFilename);
}

export const cacheIconsInfo = async () => {
  const readJSON = createJSONReader(FONTS_DIR);
  const info = readJSON<Mapping<IconInfo>>('info');

  const data = toPairs(info)
    .map(([icon, item]) => ({
      icon,
      ...omit(['prefix', 'className'], item)
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