import path from "path";
import { ROOT_DIR } from "@/constants";

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const CACHE_DIR = path.join(ROOT_DIR, 'cache');

console.log({
  ROOT_DIR
})