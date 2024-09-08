import 'dotenv/config';
import 'tsconfig-paths/register';

import { App } from "./App";

const app = new App;

const type = process.argv[2];

app.run(type);