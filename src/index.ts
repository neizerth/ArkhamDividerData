import 'dotenv/config';

import { App } from "./App";

export { IBuild as ArkhamDivider } from './types/build';

const app = new App;

const type = process.argv[2];

app.run(type);