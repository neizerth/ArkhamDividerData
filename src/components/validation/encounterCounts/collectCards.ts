import * as ArkhamBuildAPI from "@/api/arkhamBuild/api";
import { showInfo, showSuccess } from "@/util/console";
import { CARDS_FILE, ensureValidationDirs, writeValidationJson } from "./paths";
import type { CountCard } from "./types";

const cardName = (card: { real_name?: string; name?: string }) =>
	card.real_name ?? card.name ?? "";

/**
 * 1. Collect all scenario cards + one sample card per encounter set.
 */
export const collectCountCards = async (): Promise<CountCard[]> => {
	ensureValidationDirs();

	showInfo("loading Arkham Build cards...");
	const cards = await ArkhamBuildAPI.loadCards("en");

	const scenarios: CountCard[] = cards
		.filter(
			(card) => card.type_code === "scenario" && Boolean(card.encounter_code),
		)
		.map((card) => ({
			kind: "scenario" as const,
			code: card.code,
			encounter_code: card.encounter_code as string,
			card_code: card.code,
			name: cardName(card),
			pack_code: card.pack_code,
		}));

	const encounterCards = cards.filter((card) => Boolean(card.encounter_code));
	const sampleByEncounter = new Map<string, (typeof encounterCards)[number]>();

	for (const card of encounterCards) {
		const encounterCode = card.encounter_code as string;
		const existing = sampleByEncounter.get(encounterCode);

		// Prefer a non-scenario face so scenario entries stay distinct in OCR sampling.
		if (!existing) {
			sampleByEncounter.set(encounterCode, card);
			continue;
		}

		if (existing.type_code === "scenario" && card.type_code !== "scenario") {
			sampleByEncounter.set(encounterCode, card);
		}
	}

	const encounters: CountCard[] = [...sampleByEncounter.values()].map(
		(card) => ({
			kind: "encounter" as const,
			code: card.encounter_code as string,
			encounter_code: card.encounter_code as string,
			card_code: card.code,
			name: cardName(card),
			pack_code: card.pack_code,
		}),
	);

	const selected = [...scenarios, ...encounters].sort((a, b) => {
		if (a.kind !== b.kind) {
			return a.kind === "scenario" ? -1 : 1;
		}
		return a.code.localeCompare(b.code);
	});

	writeValidationJson(CARDS_FILE, selected);
	showSuccess(
		`collected ${scenarios.length} scenario cards and ${encounters.length} encounter samples → ${CARDS_FILE}.json`,
	);

	return selected;
};
