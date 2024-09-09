import { DIST_DIR } from "../config/app";
import { createJSONWriter } from "./fs";

export const buildSource = createJSONWriter(DIST_DIR);