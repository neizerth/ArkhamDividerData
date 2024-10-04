import path from "path";
import { ROOT_DIR } from "@/constants";

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const CACHE_DIR = path.join(ROOT_DIR, 'cache');

export const ASSETS_DIR = path.join(ROOT_DIR, 'assets');

export const ICONS_CACHE_DIR = path.join(CACHE_DIR, 'icons');

export const DOWNLOADS_DIR = path.join(CACHE_DIR, 'downloads');

export const ICONS_EXTRA_DIR = path.join(ASSETS_DIR, 'icons');

export const FONTS_DIR = path.join(DIST_DIR, 'fonts');