import path from 'path';

export const ROOT_DIR = path.join(__dirname, '../../');

export const DIST_DIR = path.join(ROOT_DIR, 'dist');

export const CACHE_DIR = path.join(ROOT_DIR, 'cache');

export const DATABASE_CACHE_DIR = path.join(CACHE_DIR, 'database');