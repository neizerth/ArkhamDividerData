import 'dotenv/config';

import { App } from "./App.ts";
const app = new App;

const type = process.argv[2];

app.run(type);