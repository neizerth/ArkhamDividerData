import * as Cache from "@/util/cache";
import { showError, showInfo, showSuccess } from "@/util/console";
import {
	ensureValidationDirs,
	OCR_FILE,
	readValidationJson,
	REPORT_FILE,
	writeValidationJson,
} from "./paths";
import type { CountEntry, CountReport, OcrResult } from "./types";

/**
 * 4–5. Attach DB size, sameCount, write unified report.
 */
export const buildCountReport = (): CountReport | null => {
	ensureValidationDirs();

	const ocrRows = readValidationJson<OcrResult[]>(OCR_FILE);
	if (!ocrRows?.length) {
		showError(`missing ${OCR_FILE}.json — run validate-counts recognize first`);
		return null;
	}

	showInfo("loading database encounter set sizes...");
	const encounterSets = Cache.getDatabaseEncounterSets();
	const sizeByCode = new Map(
		encounterSets.map((set) => [set.code, set.size ?? null]),
	);

	const entries: CountEntry[] = ocrRows.map((row) => {
		const dbCount = sizeByCode.has(row.encounter_code)
			? (sizeByCode.get(row.encounter_code) ?? null)
			: null;
		const sameCount =
			row.ocrCount != null && dbCount != null && row.ocrCount === dbCount;

		return {
			...row,
			dbCount,
			sameCount,
		};
	});

	const summary = {
		total: entries.length,
		matched: entries.filter((entry) => entry.sameCount).length,
		mismatched: entries.filter(
			(entry) =>
				entry.ocrCount != null && entry.dbCount != null && !entry.sameCount,
		).length,
		missingOcr: entries.filter((entry) => entry.ocrCount == null).length,
		missingDb: entries.filter((entry) => entry.dbCount == null).length,
	};

	const report: CountReport = {
		generatedAt: new Date().toISOString(),
		entries,
		summary,
	};

	writeValidationJson(REPORT_FILE, report);
	showSuccess(
		`report saved → ${REPORT_FILE}.json (matched ${summary.matched}/${summary.total}, mismatched ${summary.mismatched}, missing OCR ${summary.missingOcr}, missing DB ${summary.missingDb})`,
	);

	return report;
};
