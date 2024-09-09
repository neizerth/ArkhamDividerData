import { DIST_DIR } from "@/constants";
import { createJSONWriter } from "./fs";

export const buildSource = createJSONWriter(DIST_DIR);