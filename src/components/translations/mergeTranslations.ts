import { Mapping } from "@/types/common";
import { createReader } from "@/util/fs"
import fs from "fs"

export const mergeTranslations = (dir: string): Mapping => {
  const files = fs.readdirSync(dir)
    .filter(file => file.endsWith('.json'));

  if (files.length === 0) {
    return {};
  }
  
  const getJSON = createReader({
    dir,
    unserialize: JSON.parse
  });

  const translations = files.map(filename => getJSON(filename, {} as Mapping));

  return Object.assign({}, ...translations) as Mapping;
}