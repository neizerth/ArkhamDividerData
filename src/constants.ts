import path from "path";

const { version } = require('../package.json');
// import URL from 'node:url';
    
// const __dirname = path.dirname(URL.fileURLToPath(import.meta.url));

export const ROOT_DIR = path.join(__dirname, '/..');

export const VERSION = version;