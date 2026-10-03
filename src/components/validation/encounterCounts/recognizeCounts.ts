import { showError, showInfo, showSuccess, showWarning } from "@/util/console";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { promisify } from "util";
import {
	CARDS_FILE,
	ensureValidationDirs,
	imagePathForCode,
	OCR_CROPS_DIR,
	OCR_FILE,
	readValidationJson,
	writeValidationJson,
} from "./paths";
import type { CountCard, OcrResult } from "./types";

const execFileAsync = promisify(execFile);

/** Serif footer digits: tesseract often swaps these after invert. */
const DIGIT_CONFUSIONS: Record<string, string[]> = {
	"0": ["0", "8"],
	"1": ["1", "7"],
	"2": ["2", "9", "3"],
	"3": ["3", "2", "8"],
	"4": ["4"],
	"5": ["5", "6"],
	"6": ["6", "5"],
	"7": ["7", "1"],
	"8": ["8", "3", "0"],
	"9": ["9", "2"],
};

type CropRatio = {
	left: number;
	top: number;
	width: number;
	height: number;
};

const PRIMARY_CROP: Record<"portrait" | "landscape", CropRatio> = {
	portrait: { left: 0.6, top: 0.96, width: 0.213, height: 0.0305 },
	landscape: { left: 0.743, top: 0.947, width: 0.152, height: 0.043 },
};

const FALLBACK_CROPS: Record<"portrait" | "landscape", CropRatio[]> = {
	portrait: [
		{ left: 0.58, top: 0.955, width: 0.2, height: 0.035 },
		{ left: 0.55, top: 0.945, width: 0.28, height: 0.05 },
		{ left: 0.63, top: 0.962, width: 0.17, height: 0.028 },
	],
	landscape: [
		{ left: 0.72, top: 0.945, width: 0.16, height: 0.045 },
		{ left: 0.7, top: 0.93, width: 0.2, height: 0.055 },
		{ left: 0.76, top: 0.95, width: 0.13, height: 0.038 },
	],
};

type Fraction = {
	numerator: number;
	denominator: number;
	text: string;
	edits: number;
	rawNumerator?: number;
};

const expandDigit = (digit: string): string[] =>
	DIGIT_CONFUSIONS[digit] ?? [digit];

/** All low-edit confusion variants of a digit string (cap branching). */
const expandNumberVariants = (
	value: string,
	maxEdits = 2,
): { value: string; edits: number }[] => {
	const results = new Map<string, number>();
	const queue: { value: string; edits: number; index: number }[] = [
		{ value, edits: 0, index: 0 },
	];

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current) {
			break;
		}
		if (current.index >= current.value.length) {
			const prev = results.get(current.value);
			if (prev == null || current.edits < prev) {
				results.set(current.value, current.edits);
			}
			continue;
		}

		const digit = current.value[current.index] ?? "";
		for (const option of expandDigit(digit)) {
			const nextEdits = current.edits + (option === digit ? 0 : 1);
			if (nextEdits > maxEdits) {
				continue;
			}
			const chars = current.value.split("");
			chars[current.index] = option;
			queue.push({
				value: chars.join(""),
				edits: nextEdits,
				index: current.index + 1,
			});
		}
	}

	return [...results.entries()].map(([value, edits]) => ({ value, edits }));
};

const scoreFraction = (
	{ numerator, denominator, edits }: Fraction,
	rawNumerator?: number,
): number => {
	if (
		numerator < 1 ||
		denominator < 1 ||
		numerator > denominator ||
		denominator > 200
	) {
		return Number.NEGATIVE_INFINITY;
	}

	let score = 20 - edits * 3;

	if (denominator <= 60) {
		score += 8;
	} else if (denominator <= 80) {
		score += 4;
	} else if (denominator >= 90 && denominator <= 99) {
		// Classic 2→9 misread decade (20→90, 21→91…).
		score -= 10;
	}

	if (numerator <= 20) {
		score += 2;
	}

	// Keep the printed encounter index when possible (avoid 3/3 → 2/2).
	if (rawNumerator != null && numerator === rawNumerator) {
		score += 5;
	}

	return score;
};

const denominatorVariants = (
	rawDen: string,
	rawNum: string,
): { value: string; edits: number }[] => {
	const variants = new Map<string, number>();
	const add = (value: string, edits: number) => {
		if (!/^\d+$/.test(value) || value.length === 0) {
			return;
		}
		const prev = variants.get(value);
		if (prev == null || edits < prev) {
			variants.set(value, edits);
		}
	};

	for (const variant of expandNumberVariants(rawDen)) {
		add(variant.value, variant.edits);
	}

	// Trailing icon noise: "158"→"15".
	if (rawDen.length === 3) {
		add(rawDen.slice(0, 2), 1);
		for (const variant of expandNumberVariants(rawDen.slice(0, 2), 1)) {
			add(variant.value, variant.edits + 1);
		}
	}
	// Phantom trailing zero on "1/90" only (icon noise → "1/9").
	// Prefer this over interpreting as 1/20 (9→2). Skip for "9/90".
	if (rawDen === "90" && rawNum === "1") {
		add("9", 0);
	}

	return [...variants.entries()].map(([value, edits]) => ({ value, edits }));
};

const fractionsFromText = (text: string): Fraction[] => {
	const matches = [...text.matchAll(/(\d{1,3})\s*\/\s*(\d{1,3})/g)];
	const fractions: Fraction[] = [];

	for (const match of matches) {
		const rawNum = match[1] ?? "";
		const rawDen = match[2] ?? "";
		const rawNumerator = Number(rawNum);
		for (const numVar of expandNumberVariants(rawNum)) {
			for (const denVar of denominatorVariants(rawDen, rawNum)) {
				fractions.push({
					numerator: Number(numVar.value),
					denominator: Number(denVar.value),
					text: `${numVar.value}/${denVar.value}`,
					edits: numVar.edits + denVar.edits,
					rawNumerator,
				});
			}
		}
	}

	return fractions;
};

const pickBestFraction = (fractions: Fraction[]): Fraction | null => {
	const ranked = fractions
		.map((fraction) => ({
			fraction,
			score: scoreFraction(fraction, fraction.rawNumerator),
		}))
		.filter(({ score }) => Number.isFinite(score))
		.sort((a, b) => b.score - a.score);

	return ranked[0]?.fraction ?? null;
};

const extractBox = (width: number, height: number, ratio: CropRatio) => {
	const left = Math.floor(width * ratio.left);
	const top = Math.floor(height * ratio.top);
	return {
		left,
		top,
		width: Math.min(Math.floor(width * ratio.width), width - left),
		height: Math.min(
			Math.max(24, Math.floor(height * ratio.height)),
			height - top,
		),
	};
};

const renderCrop = async (
	imagePath: string,
	cropPath: string,
	box: { left: number; top: number; width: number; height: number },
	mode: "negate" | "plain",
) => {
	let pipeline = sharp(imagePath).extract(box).greyscale();
	pipeline =
		mode === "negate"
			? pipeline.negate().normalise()
			: pipeline.normalise().linear(1.6, -30);

	await pipeline
		.resize({
			width: 800,
			height: 160,
			fit: "fill",
			kernel: "lanczos3",
		})
		.sharpen()
		.png()
		.toFile(cropPath);
};

const runTesseract = async (cropPath: string, psm: string): Promise<string> => {
	const { stdout } = await execFileAsync(
		"tesseract",
		[
			cropPath,
			"stdout",
			"--psm",
			psm,
			"--dpi",
			"300",
			"-c",
			"tessedit_char_whitelist=0123456789/",
		],
		{ encoding: "utf8" },
	);
	return stdout.trim();
};

const recognizeWithCrop = async (
	imagePath: string,
	cropPathBase: string,
	width: number,
	height: number,
	ratio: CropRatio,
): Promise<{ fractions: Fraction[]; rawTexts: string[] }> => {
	const box = extractBox(width, height, ratio);
	const fractions: Fraction[] = [];
	const rawTexts: string[] = [];

	for (const mode of ["negate", "plain"] as const) {
		const cropPath = `${cropPathBase}-${mode}.png`;
		await renderCrop(imagePath, cropPath, box, mode);
		for (const psm of ["6", "7"]) {
			try {
				const rawText = await runTesseract(cropPath, psm);
				if (!rawText) {
					continue;
				}
				rawTexts.push(rawText);
				fractions.push(...fractionsFromText(rawText));
			} catch {
				// next pass
			}
		}
	}

	return { fractions, rawTexts };
};

const recognizeImage = async (
	imagePath: string,
	cropPathBase: string,
): Promise<{ ocrCount: number | null; ocrText: string | null }> => {
	const meta = await sharp(imagePath).metadata();
	const width = meta.width ?? 0;
	const height = meta.height ?? 0;
	if (width < 100 || height < 100) {
		throw new Error(`unexpected image size ${width}x${height}`);
	}

	const orientation = width > height ? "landscape" : "portrait";
	const crops = [PRIMARY_CROP[orientation], ...FALLBACK_CROPS[orientation]];

	let fallbackText: string | null = null;
	const allFractions: Fraction[] = [];

	for (const [index, ratio] of crops.entries()) {
		const cropPath = `${cropPathBase}-${index}`;
		try {
			const { fractions, rawTexts } = await recognizeWithCrop(
				imagePath,
				cropPath,
				width,
				height,
				ratio,
			);
			if (rawTexts[0]) {
				fallbackText ??= rawTexts[0];
			}
			for (const fraction of fractions) {
				allFractions.push({
					...fraction,
					edits: fraction.edits + (index === 0 ? 0 : 1),
				});
			}
			// Fallbacks only if the primary crop produced nothing usable.
			if (index === 0 && pickBestFraction(allFractions)) {
				break;
			}
		} catch {
			// try next crop
		}
	}

	const best = pickBestFraction(allFractions);
	if (!best) {
		return { ocrCount: null, ocrText: fallbackText };
	}

	return {
		ocrCount: best.denominator,
		ocrText: best.text,
	};
};

const recognizeCard = async (card: CountCard): Promise<OcrResult> => {
	const imagePath = imagePathForCode(card.card_code);
	const base: OcrResult = {
		code: card.code,
		kind: card.kind,
		encounter_code: card.encounter_code,
		card_code: card.card_code,
		name: card.name,
		pack_code: card.pack_code,
		ocrCount: null,
		ocrText: null,
		imageMissing: false,
	};

	if (!fs.existsSync(imagePath)) {
		return { ...base, imageMissing: true };
	}

	const cropPathBase = path.join(
		OCR_CROPS_DIR,
		`${card.kind}-${card.code.replace(/[^\w.-]+/g, "_")}`,
	);

	try {
		const { ocrCount, ocrText } = await recognizeImage(imagePath, cropPathBase);
		return { ...base, ocrCount, ocrText };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		showWarning(`OCR ${card.card_code}: ${message}`);
		return base;
	}
};

/**
 * 3. OCR bottom-right set totals for each collected card.
 */
export const recognizeCountImages = async (): Promise<OcrResult[]> => {
	ensureValidationDirs();

	const cards = readValidationJson<CountCard[]>(CARDS_FILE);
	if (!cards?.length) {
		showError(`missing ${CARDS_FILE}.json — run validate-counts cards first`);
		return [];
	}

	showInfo(`recognizing ${cards.length} images (requires local tesseract)...`);

	const results: OcrResult[] = [];
	for (const [index, card] of cards.entries()) {
		if ((index + 1) % 25 === 0 || index === 0) {
			showInfo(`OCR ${index + 1}/${cards.length}...`);
		}
		results.push(await recognizeCard(card));
	}

	const withCount = results.filter((row) => row.ocrCount != null).length;
	writeValidationJson(OCR_FILE, results);
	showSuccess(
		`OCR done — ${withCount}/${results.length} totals parsed → ${OCR_FILE}.json`,
	);

	return results;
};
