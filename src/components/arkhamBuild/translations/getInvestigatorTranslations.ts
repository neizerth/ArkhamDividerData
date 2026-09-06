import * as API from "@/api/arkhamBuild/api";
import { resolveArkhamBuildLanguage } from "@/api/arkhamBuild/constants";
import type { IArkhamBuild } from "@/types/arkhamBuild";
import type { Mapping } from "@/types/common";
import * as Cache from "@/util/cache";
import { createPropTranslator } from "@/util/common";
import { isNotNil, propEq } from "ramda";

const TRANSLATED_PROPS = ["name", "real_name", "subname"] as const;

/**
 * Build English → localized name maps by comparing arkham.build cards.
 * English values come from `real_*`; localized values from `name` / `subname`.
 */
export const getInvestigatorTranslations = async (
	language: string,
): Promise<Mapping> => {
	const resolved = resolveArkhamBuildLanguage(language);
	if (!resolved || resolved === "en") {
		return {};
	}

	console.log(
		`getting Arkham Build investigator translations (${resolved})...`,
	);

	const packInvestigators = Cache.getPackInvestigators();
	const localCards = await API.loadInvestigators(language);

	const mappings = packInvestigators
		.map((baseInvestigator) => {
			const localCard = localCards.find(
				propEq(baseInvestigator.code, "code"),
			);
			if (!localCard) {
				return null;
			}

			return translateInvestigator(baseInvestigator, localCard);
		})
		.filter(isNotNil);

	return Object.assign({}, ...mappings);
};

const translateInvestigator = (
	base: {
		name: string;
		real_name?: string;
		subname?: string;
	},
	local: IArkhamBuild.Investigator,
): Mapping => {
	const source = {
		name: base.name,
		real_name: base.real_name ?? base.name,
		subname: base.subname ?? "",
	};

	const translation = {
		name: local.name ?? local.real_name,
		real_name: local.name ?? local.real_name,
		subname: local.subname ?? local.real_subname ?? "",
	};

	const translateProps = createPropTranslator(source, translation);
	return translateProps([...TRANSLATED_PROPS]);
};

/**
 * Generic card-field translations: real_* (EN) → localized field.
 * Useful for scenario / encounter card titles beyond investigators.
 */
export const getCardFieldTranslations = async (
	language: string,
	fields: Array<{ source: keyof IArkhamBuild.Card; target: keyof IArkhamBuild.Card }> = [
		{ source: "real_name", target: "name" },
		{ source: "real_subname", target: "subname" },
	],
): Promise<Mapping> => {
	const resolved = resolveArkhamBuildLanguage(language);
	if (!resolved || resolved === "en") {
		return {};
	}

	const cards = await API.loadCards(language);
	const mapping: Mapping = {};

	for (const card of cards) {
		for (const { source, target } of fields) {
			const english = card[source];
			const localized = card[target];
			if (
				typeof english === "string" &&
				typeof localized === "string" &&
				english &&
				localized &&
				english !== localized
			) {
				mapping[english] = localized;
			}
		}
	}

	return mapping;
};
