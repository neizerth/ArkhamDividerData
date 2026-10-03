import { CACHE_DIR } from "@/config/app";
import { createFilenameResolver, createJSONReader } from "@/util/fs";
import fs from "fs";
import path from "path";

export const VALIDATION_DIR = path.join(
	CACHE_DIR,
	"validation",
	"encounter-counts",
);
export const IMAGES_DIR = path.join(VALIDATION_DIR, "images");
export const OCR_CROPS_DIR = path.join(VALIDATION_DIR, "ocr-crops");

export const CARDS_FILE = "cards";
export const OCR_FILE = "ocr";
export const REPORT_FILE = "report";

export const ensureValidationDirs = () => {
	fs.mkdirSync(IMAGES_DIR, { recursive: true });
	fs.mkdirSync(OCR_CROPS_DIR, { recursive: true });
};

const resolveJson = createFilenameResolver(VALIDATION_DIR, "json");

/** Pretty-printed JSON for local inspection. */
export const writeValidationJson = (name: string, data: object) => {
	ensureValidationDirs();
	fs.writeFileSync(resolveJson(name), `${JSON.stringify(data, null, 2)}\n`);
};

export const readValidationJson = createJSONReader(VALIDATION_DIR);

export const imagePathForCode = (cardCode: string) =>
	path.join(IMAGES_DIR, `${cardCode}.webp`);
