export type ValidationEncounterSetSize = {
	code: string;
	size: number;
	full_size?: number;
	note?: string;
};

export type ValidationScenario = ValidationEncounterSetSize & {
	encounter_sets: string[];
	extra_encounter_sets: string[];
};

export type CampaignValidationData = {
	code: string;
	encounter_sets: ValidationEncounterSetSize[];
	extra_encounter_sets: ValidationEncounterSetSize[];
	scenarios: ValidationScenario[];
	size: number;
};
