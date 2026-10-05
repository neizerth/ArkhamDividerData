import { showError, showInfo, showSuccess, showWarning } from "@/util/console";
import {
	ensureHobbyGamesValidationDirs,
	HOBBY_GAMES_REPORT_FILE,
	readHobbyGamesValidationJson,
} from "./paths";
import type { HobbyGamesCountReport } from "./types";

/**
 * 4. Fail if any comparable Hobby vs DB totals differ.
 */
export const checkHobbyGamesCountReport = (): boolean => {
	ensureHobbyGamesValidationDirs();

	const report = readHobbyGamesValidationJson<HobbyGamesCountReport>(HOBBY_GAMES_REPORT_FILE);
	if (!report?.entries?.length) {
		showError(
			`missing ${HOBBY_GAMES_REPORT_FILE}.json — run validate-hobbyGames report first`,
		);
		return false;
	}

	const { summary, entries } = report;
	showInfo(
		`checking Hobby report (${summary.total} entries, generated ${report.generatedAt})...`,
	);

	if (summary.missingHobbyGames > 0) {
		showWarning(`missing Hobby counts: ${summary.missingHobbyGames}`);
	}
	if (summary.missingDb > 0) {
		showWarning(`missing DB sizes: ${summary.missingDb}`);
	}

	const comparable = entries.filter(
		(entry) => entry.hobbyGamesCount != null && entry.dbCount != null,
	);
	const failures = comparable.filter((entry) => !entry.sameCount);

	if (failures.length > 0) {
		showError(
			`product size mismatch: ${failures.length}/${comparable.length} differ from Hobby Games`,
		);
		for (const entry of failures) {
			showError(
				`  [${entry.story_code}] ${entry.name}: Hobby=${entry.hobbyGamesCount} DB=${entry.dbCount} (${entry.hobbyGamesText ?? "—"})`,
			);
		}
		return false;
	}

	if (comparable.length === 0) {
		showError("no comparable Hobby/DB entries");
		return false;
	}

	showSuccess(
		`validation OK — ${comparable.length} products match Hobby Games card totals`,
	);
	return true;
};
