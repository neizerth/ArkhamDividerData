import { CACHE_DIR } from "@/config/app";
import { createFilenameResolver, createJSONReader } from "@/util/fs";
import fs from "fs";
import path from "path";

export const HOBBY_GAMES_VALIDATION_DIR = path.join(
	CACHE_DIR,
	"validation",
	"hobbyGames-counts",
);
export const HOBBY_GAMES_PAGES_DIR = path.join(HOBBY_GAMES_VALIDATION_DIR, "pages");

export const HOBBY_GAMES_PAGES_FILE = "pages";
export const HOBBY_GAMES_REPORT_FILE = "report";

export const ensureHobbyGamesValidationDirs = () => {
	fs.mkdirSync(HOBBY_GAMES_PAGES_DIR, { recursive: true });
};

const resolveJson = createFilenameResolver(HOBBY_GAMES_VALIDATION_DIR, "json");

export const writeHobbyGamesValidationJson = (name: string, data: object) => {
	ensureHobbyGamesValidationDirs();
	fs.writeFileSync(resolveJson(name), `${JSON.stringify(data, null, 2)}\n`);
};

export const readHobbyGamesValidationJson = createJSONReader(HOBBY_GAMES_VALIDATION_DIR);

export const hobbyGamesPagePath = (slug: string) =>
	path.join(HOBBY_GAMES_PAGES_DIR, `${slug}.html`);
