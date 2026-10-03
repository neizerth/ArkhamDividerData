import {
	buildCountReport,
	checkCountReport,
	collectCountCards,
	downloadCountImages,
	recognizeCountImages,
} from "@/components/validation/encounterCounts";
import { showError, showInfo } from "@/util/console";

export type ValidateEncounterCountsStep =
	| "cards"
	| "images"
	| "recognize"
	| "report"
	| "check"
	| "all";

const STEPS: ValidateEncounterCountsStep[] = [
	"cards",
	"images",
	"recognize",
	"report",
	"check",
	"all",
];

/**
 * Local-only validation against arkham.build card scans.
 * Not part of the default CI pipeline (`npm start` without args).
 *
 * Steps:
 * 1. cards     — collect scenario + encounter sample cards
 * 2. images    — download CDN webp scans into cache/
 * 3. recognize — OCR footer totals
 * 4. report    — merge DB sizes + sameCount into one JSON
 * 5. check     — fail if any comparable sameCount is false
 */
export const validateEncounterCounts = async (
	step: string = "all",
): Promise<void> => {
	const normalized = (step || "all") as ValidateEncounterCountsStep;

	if (!STEPS.includes(normalized)) {
		showError(
			`unknown validate-counts step "${step}". Use: ${STEPS.join(" | ")}`,
		);
		return;
	}

	showInfo(`validate-counts: ${normalized}`);

	const runCards = normalized === "cards" || normalized === "all";
	const runImages = normalized === "images" || normalized === "all";
	const runRecognize = normalized === "recognize" || normalized === "all";
	const runReport = normalized === "report" || normalized === "all";
	const runCheck = normalized === "check" || normalized === "all";

	if (runCards) {
		await collectCountCards();
	}
	if (runImages) {
		await downloadCountImages();
	}
	if (runRecognize) {
		await recognizeCountImages();
	}
	if (runReport) {
		buildCountReport();
	}
	if (runCheck) {
		const ok = checkCountReport();
		if (!ok) {
			process.exitCode = 1;
		}
	}
};
