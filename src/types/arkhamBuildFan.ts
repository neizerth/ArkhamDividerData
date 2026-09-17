export namespace IArkhamBuildFan {
	export type ProjectMeta = {
		code: string;
		name: string;
		description?: string;
		author?: string;
		language?: string;
		types?: string[];
		status?: string;
		date_updated?: string;
		external_link?: string;
		banner_url?: string;
		generator?: string;
	};

	export type EncounterSet = {
		code: string;
		name: string;
		icon_url?: string;
	};

	export type Pack = {
		code: string;
		name: string;
	};

	export type Card = {
		code: string;
		name: string;
		pack_code: string;
		position: number;
		quantity: number;
		type_code: string;
		faction_code?: string;
		encounter_code?: string;
		encounter_position?: number;
		back_link?: string;
		back_link_id?: string;
		double_sided?: boolean;
	};

	export type ProjectData = {
		cards: Card[];
		encounter_sets: EncounterSet[];
		packs: Pack[];
	};

	export type Project = {
		meta: ProjectMeta;
		data: ProjectData;
	};
}
