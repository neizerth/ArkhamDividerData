import { DOWNLOADS_DIR } from '@/config/app';
import fs from 'fs';
import path from 'path';

export type IGetWithPrefixOptions<T> = {
  responseType?: 'text' | 'json'
  defaultData?: T
}

export const getWithPrefix = (dir: string) => {
  return async <T = string>(name: string, options?: IGetWithPrefixOptions<T>) => {
    const responseType = options?.responseType || 'json';
    const defaultData = options?.defaultData as T

    const filename = path.join(DOWNLOADS_DIR, '/', dir, '/', name);

    if (!fs.existsSync(filename)) {
      return {
        data: defaultData
      };
    }

    const contents = fs.readFileSync(filename);

    if (responseType === 'text') {
      const data = contents.toString() as T
      return { data }
    }

    if (responseType === 'json') {
      const data = JSON.parse(contents.toString()) as T
      return { data }
    }

    return { data: contents.toString() as T };
  }
}

export const getContents = (dir: string) => {
  return async (dirPath: string) => {
    const target = path.join(DOWNLOADS_DIR, '/', dir, '/', dirPath); 
    const data = fs.readdirSync(target)
      .filter(file => !file.startsWith('.'))
    return {
      data
    }
  }
}