import { downloadOptimizedCardImage } from "@/api/arkhamBuild/images";
import { showError, showInfo, showSuccess, showWarning } from "@/util/console";
import {
	CARDS_FILE,
	ensureValidationDirs,
	imagePathForCode,
	readValidationJson,
} from "./paths";
import type { CountCard } from "./types";

/**
 * 2. Download CDN scans for collected cards into cache (gitignored).
 */
export const downloadCountImages = async (): Promise<void> => {
	ensureValidationDirs();

	const cards = readValidationJson<CountCard[]>(CARDS_FILE);
	if (!cards?.length) {
		showError(`missing ${CARDS_FILE}.json — run validate-counts cards first`);
		return;
	}

	const uniqueCodes = [...new Set(cards.map((card) => card.card_code))];
	showInfo(`downloading ${uniqueCodes.length} card images...`);

	let cached = 0;
	let downloaded = 0;
	let missing = 0;
	let errors = 0;

	for (const [index, code] of uniqueCodes.entries()) {
		if ((index + 1) % 50 === 0 || index === 0) {
			showInfo(`images ${index + 1}/${uniqueCodes.length}...`);
		}

		const result = await downloadOptimizedCardImage(
			code,
			imagePathForCode(code),
		);

		switch (result.status) {
			case "cached":
				cached += 1;
				break;
			case "downloaded":
				downloaded += 1;
				break;
			case "missing":
				missing += 1;
				break;
			case "error":
				errors += 1;
				showWarning(`image ${code}: ${result.error}`);
				break;
		}
	}

	showSuccess(
		`images done — downloaded ${downloaded}, cached ${cached}, missing ${missing}, errors ${errors}`,
	);
};
