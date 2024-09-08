import { CACHE_DIR } from "@/config/app";
import path from "path";
import fs from 'fs';
import { CacheType } from "@/types/cache";

export const cache = <T>(name: CacheType, data: object) => {
    
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR);
  }

  const contents = JSON.stringify(data);

  const filename = getCacheFileName(name);

  fs.writeFileSync(filename, contents);
}

const getCacheFileName = (name: string) => path.join(`${CACHE_DIR}/${name}.json`)

export const getCache = <T>(name: string, defaultValue?: T): T  => {
  if (!fs.existsSync(CACHE_DIR)) {
    return defaultValue as T;
  }
  const filename = getCacheFileName(name);
  if (!fs.existsSync(filename)) {
    return defaultValue as T;
  }
  const data = fs.readFileSync(filename);
  const json = JSON.parse(data.toString());

  return json;
}