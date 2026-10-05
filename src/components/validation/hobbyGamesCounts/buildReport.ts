import * as Cache from "@/util/cache";
import { showError, showInfo, showSuccess } from "@/util/console";
import { getCampaignProductSize } from "./getCampaignProductSize";
import {
	ensureHobbyGamesValidationDirs,
	HOBBY_GAMES_PAGES_FILE,
	HOBBY_GAMES_REPORT_FILE,
	readHobbyGamesValidationJson,
	writeHobbyGamesValidationJson,
} from "./paths";
import { HOBBY_GAMES_PRODUCTS } from "./products";
import type {
	HobbyGamesCountEntry,
	HobbyGamesCountReport,
	HobbyGamesPageData,
} from "./types";

/**
 * 2–3. Compare Hobby Games totals with our campaign product sizes.
 */
export const buildHobbyGamesCountReport = (): HobbyGamesCountReport | null => {
	ensureHobbyGamesValidationDirs();

	const pages = readHobbyGamesValidationJson<HobbyGamesPageData[]>(
		HOBBY_GAMES_PAGES_FILE,
	);
	if (!pages?.length) {
		showError(
			`missing ${HOBBY_GAMES_PAGES_FILE}.json — run validate-hobbyGames fetch first`,
		);
		return null;
	}

	const activeStoryCodes = new Set(
		HOBBY_GAMES_PRODUCTS.map((product) => product.story_code),
	);
	const activePages = pages.filter((page) =>
		activeStoryCodes.has(page.story_code),
	);

	showInfo("loading stories and encounter set sizes...");
	const stories = Cache.getStories();
	const storyByCode = new Map(stories.map((story) => [story.code, story]));

	const entries: HobbyGamesCountEntry[] = activePages.map((page) => {
		const story = storyByCode.get(page.story_code);
		const productSize = story ? getCampaignProductSize(story) : null;
		const dbCount =
			productSize && productSize.total > 0 ? productSize.total : null;
		const sameCount =
			page.hobbyGamesCount != null &&
			dbCount != null &&
			page.hobbyGamesCount === dbCount;

		return {
			...page,
			name: story?.name ?? page.title ?? page.story_code,
			cycle_code: story?.cycle_code,
			dbCount,
			dbSetCount: productSize?.setCount ?? 0,
			sameCount,
		};
	});

	const summary = {
		total: entries.length,
		matched: entries.filter((entry) => entry.sameCount).length,
		mismatched: entries.filter(
			(entry) =>
				entry.hobbyGamesCount != null &&
				entry.dbCount != null &&
				!entry.sameCount,
		).length,
		missingHobbyGames: entries.filter((entry) => entry.hobbyGamesCount == null)
			.length,
		missingDb: entries.filter((entry) => entry.dbCount == null).length,
	};

	const report: HobbyGamesCountReport = {
		generatedAt: new Date().toISOString(),
		entries,
		summary,
	};

	writeHobbyGamesValidationJson(HOBBY_GAMES_REPORT_FILE, report);
	showSuccess(
		`report saved → ${HOBBY_GAMES_REPORT_FILE}.json (matched ${summary.matched}/${summary.total}, mismatched ${summary.mismatched}, missing Hobby ${summary.missingHobbyGames}, missing DB ${summary.missingDb})`,
	);

	return report;
};
