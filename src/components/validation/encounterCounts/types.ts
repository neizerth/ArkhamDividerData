export type CountKind = "scenario" | "encounter";

/** Cards selected for image download / OCR. */
export type CountCard = {
	kind: CountKind;
	/** Scenario card code, or encounter set code for encounter entries. */
	code: string;
	encounter_code: string;
	/** Card whose CDN image is used for OCR. */
	card_code: string;
	name: string;
	pack_code: string;
};

export type OcrResult = {
	code: string;
	kind: CountKind;
	encounter_code: string;
	card_code: string;
	name: string;
	pack_code: string;
	ocrCount: number | null;
	ocrText: string | null;
	imageMissing: boolean;
};

export type CountEntry = OcrResult & {
	dbCount: number | null;
	sameCount: boolean;
};

export type CountReport = {
	generatedAt: string;
	entries: CountEntry[];
	summary: {
		total: number;
		matched: number;
		mismatched: number;
		missingOcr: number;
		missingDb: number;
	};
};
