import dotenv from 'dotenv';

dotenv.config({
  path: ['.env.local', '.env']
});

import { App } from "./App";
const app = new App;

const type = process.argv[2];

app.run(type);