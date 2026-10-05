import {
	buildHobbyGamesCountReport,
	checkHobbyGamesCountReport,
	fetchHobbyGamesPages,
} from "@/components/validation/hobbyGamesCounts";
import { showError, showInfo } from "@/util/console";

export type ValidateHobbyGamesCountsStep = "fetch" | "report" | "check" | "all";

const STEPS: ValidateHobbyGamesCountsStep[] = ["fetch", "report", "check", "all"];

/**
 * Local-only validation against Hobby Games product descriptions.
 * Not part of the default CI pipeline (`npm start` without args).
 *
 * Steps:
 * 1. fetch  — download campaign product pages, parse "N карт сценария"
 * 2. report — compare with sum of own-pack encounter set sizes
 * 3. check  — fail if any sameCount is false
 */
export const validateHobbyGamesCounts = async (
	step: string = "all",
): Promise<void> => {
	const normalized = (step || "all") as ValidateHobbyGamesCountsStep;

	if (!STEPS.includes(normalized)) {
		showError(
			`unknown validate-hobbyGames step "${step}". Use: ${STEPS.join(" | ")}`,
		);
		return;
	}

	showInfo(`validate-hobbyGames: ${normalized}`);

	const runFetch = normalized === "fetch" || normalized === "all";
	const runReport = normalized === "report" || normalized === "all";
	const runCheck = normalized === "check" || normalized === "all";

	if (runFetch) {
		await fetchHobbyGamesPages();
	}
	if (runReport) {
		buildHobbyGamesCountReport();
	}
	if (runCheck) {
		const ok = checkHobbyGamesCountReport();
		if (!ok) {
			process.exitCode = 1;
		}
	}
};
