import { showError, showInfo, showSuccess, showWarning } from "@/util/console";
import { ensureValidationDirs, readValidationJson, REPORT_FILE } from "./paths";
import type { CountReport } from "./types";

/**
 * 6. Validation gate: every entry with both counts must have sameCount.
 */
export const checkCountReport = (): boolean => {
	ensureValidationDirs();

	const report = readValidationJson<CountReport>(REPORT_FILE);
	if (!report?.entries?.length) {
		showError(`missing ${REPORT_FILE}.json — run validate-counts report first`);
		return false;
	}

	const { summary, entries } = report;
	showInfo(
		`checking report (${summary.total} entries, generated ${report.generatedAt})...`,
	);

	const comparable = entries.filter(
		(entry) => entry.ocrCount != null && entry.dbCount != null,
	);
	const failures = comparable.filter((entry) => !entry.sameCount);

	if (summary.missingOcr > 0) {
		showWarning(`missing OCR totals: ${summary.missingOcr}`);
	}
	if (summary.missingDb > 0) {
		showWarning(`missing DB sizes: ${summary.missingDb}`);
	}

	if (failures.length > 0) {
		showError(
			`size algorithm mismatch: ${failures.length}/${comparable.length} comparable entries differ`,
		);
		for (const entry of failures.slice(0, 20)) {
			showError(
				`  [${entry.kind}] ${entry.code} (${entry.encounter_code}): OCR=${entry.ocrCount} DB=${entry.dbCount} card=${entry.card_code}`,
			);
		}
		if (failures.length > 20) {
			showError(`  ...and ${failures.length - 20} more`);
		}
		return false;
	}

	if (comparable.length === 0) {
		showError("no comparable entries (need both OCR and DB counts)");
		return false;
	}

	showSuccess(
		`validation OK — ${comparable.length} entries have sameCount=true`,
	);
	return true;
};
