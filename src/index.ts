import 'dotenv/config';

import { App } from "./App";
import { argv } from 'process';

const app = new App;

const type = process.argv[2];
app.run(type);