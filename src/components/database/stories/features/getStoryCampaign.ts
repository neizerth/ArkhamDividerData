import type { IIconDB } from "@/components/arkhamCards/icons/IconDB";
import type { IArkhamCards } from "@/types/arkhamCards";
import type { ICache } from "@/types/cache";
import type { IDatabase } from "@/types/database";
import { normalizeEncounterCodes } from "@/util/encounterCanonical";
import { prop, propEq, uniqBy } from "ramda";

export const createStoryCampaignHandler = ({
	iconDB,
	scenarioEncounters,
	canonicalizeEncounterCode,
}: {
	iconDB: IIconDB;
	scenarioEncounters: ICache.ScenarioEncounterSet[];
	canonicalizeEncounterCode: (code: string) => string;
}) => {
	return ({
		fullCampaign,
		cycle_code,
	}: {
		fullCampaign: IArkhamCards.JSON.FullCampaign;
		cycle_code?: string;
	}): IDatabase.StoryCampaign => {
		const { campaign, scenarios } = fullCampaign;

		const { id, name } = campaign;

		const iconList = [];

		if (id === "core") {
			iconList.push(campaign.id);
		}

		iconList.push(cycle_code);

		const notCore = scenarios.filter(({ id }) => id !== 'core');

		const data = {
			id,
			name,
			icon: iconDB.getIconOf({ ids: iconList, type: "scenario" }),
			scenarios: notCore.map(prop("id")),
		};

		const encounters = uniqBy(
			prop("encounter_set_code"),
			scenarioEncounters.filter(propEq(id, "campaign_id")),
		);

		const requiredEncounters = normalizeEncounterCodes(
			encounters
				.filter(propEq(false, "is_extra"))
				.map(prop("encounter_set_code")),
			canonicalizeEncounterCode,
		);

		const extraEncounters = normalizeEncounterCodes(
			encounters
				.filter(propEq(true, "is_extra"))
				.map(prop("encounter_set_code")),
			canonicalizeEncounterCode,
		);

		return {
			...data,
			encounter_sets: requiredEncounters,
			extra_encounter_sets: extraEncounters,
		};
	};
};
