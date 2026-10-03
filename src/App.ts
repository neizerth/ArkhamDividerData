import * as app from "@/config/app";
import {
	buildFromCache,
	createAssets,
	createCache,
	createDatabaseCache,
	createDatabaseIconsCache,
	createIconFont,
	createIconsCache,
	createTranslationsCache,
	downloadRepos,
	prepareIcons,
	validateEncounterCounts,
} from "./jobs";

export class App {
	async run(command?: string) {
		console.log("starting application");

		switch (command) {
			case "env":
				return console.log(app);
			case "translations":
				return await createTranslationsCache();
			case "database":
				await createDatabaseCache();
				return createDatabaseIconsCache();
			case "cache":
				return await createCache();
			case "prepare-icons":
				return await prepareIcons();
			case "cache-icons":
				return await createIconsCache();
			case "download":
				return await downloadRepos();
			case "font":
				return await createIconFont();
			case "assets":
				return await createAssets();
			case "build":
				return await buildFromCache();
			case "validate-counts":
				// Local OCR validation only — not invoked by CI (`npm start` default).
				return await validateEncounterCounts(process.argv[3]);
		}

		await downloadRepos();
		await createCache();
		await createIconFont();
		await buildFromCache();
	}
}
