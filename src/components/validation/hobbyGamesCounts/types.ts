export type HobbyGamesCampaignProduct = {
	/** Story / campaign code in our DB (e.g. `dwl`, `tdc`, `core_2026`). */
	story_code: string;
	/** Hobby Games product slug (path after domain). */
	slug: string;
	/** Optional human label override. */
	label?: string;
};

export type HobbyGamesPageData = {
	story_code: string;
	slug: string;
	url: string;
	title: string | null;
	hobbyGamesCount: number | null;
	hobbyGamesText: string | null;
	fetchedAt: string;
	error?: string;
};

export type HobbyGamesCountEntry = HobbyGamesPageData & {
	name: string;
	cycle_code?: string;
	dbCount: number | null;
	dbSetCount: number;
	sameCount: boolean;
};

export type HobbyGamesCountReport = {
	generatedAt: string;
	entries: HobbyGamesCountEntry[];
	summary: {
		total: number;
		matched: number;
		mismatched: number;
		missingHobbyGames: number;
		missingDb: number;
	};
};
