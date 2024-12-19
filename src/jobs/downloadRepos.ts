import path from 'path';
import fs from 'fs';
import decompress from 'decompress';
import { download } from "@/api/download"
import { DOWNLOADS_DIR } from '@/config/app';
import { mkDir, rmDir } from '@/util/fs';
import * as API from '@/config/api';

export const downloadRepos = async () => {
  rmDir(DOWNLOADS_DIR);
  mkDir(DOWNLOADS_DIR);
  console.log('processing ArkhamDB...');
  await processRepo(API.ARKHAMDB_DATA_ZIP_URL);

  console.log('processing ArkhamCards...');
  await processRepo(API.ARKHAM_CARDS_CONTENTS_ZIP_URL);

  console.log('processing ArkhamCards Data...');
  await processRepo(API.ARKHAM_CARDS_DATA_ZIP_URL);
}

export const processRepo = async (url: string) => {
  console.log('downloading file...');
  const name =  'tmp.zip';
  await download(url, DOWNLOADS_DIR, name);
  const filename = path.join(DOWNLOADS_DIR, '/', name)
  console.log('decompressing file...')
  await decompress(filename, DOWNLOADS_DIR);
  fs.unlinkSync(filename);
}
