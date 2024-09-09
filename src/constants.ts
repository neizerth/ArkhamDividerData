import path from "path";

export const ROOT_DIR = path.join(__dirname, '..');

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const CACHE_DIR = path.join(ROOT_DIR, 'cache');

console.log({
  ROOT_DIR
})