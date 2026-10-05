import { showError, showInfo, showSuccess, showWarning } from "@/util/console";
import axios from "axios";
import fs from "fs";
import { extractHtmlTitle, parseHobbyGamesScenarioCardCount } from "./parsePage";
import {
	ensureHobbyGamesValidationDirs,
	HOBBY_GAMES_PAGES_FILE,
	hobbyGamesPagePath,
	writeHobbyGamesValidationJson,
} from "./paths";
import { HOBBY_GAMES_BASE_URL, HOBBY_GAMES_PRODUCTS } from "./products";
import type { HobbyGamesPageData } from "./types";

const USER_AGENT =
	"Mozilla/5.0 (compatible; ArkhamDividerData/1.6; +https://github.com/neizerth/ArkhamDividerData)";

/**
 * 1. Download Hobby Games product pages into cache (gitignored).
 */
export const fetchHobbyGamesPages = async ({
	useCache = true,
}: {
	useCache?: boolean;
} = {}): Promise<HobbyGamesPageData[]> => {
	ensureHobbyGamesValidationDirs();
	showInfo(`fetching ${HOBBY_GAMES_PRODUCTS.length} Hobby Games pages...`);

	const pages: HobbyGamesPageData[] = [];

	for (const product of HOBBY_GAMES_PRODUCTS) {
		const url = `${HOBBY_GAMES_BASE_URL}/${product.slug}`;
		const filePath = hobbyGamesPagePath(product.slug);
		const base: HobbyGamesPageData = {
			story_code: product.story_code,
			slug: product.slug,
			url,
			title: product.label ?? null,
			hobbyGamesCount: null,
			hobbyGamesText: null,
			fetchedAt: new Date().toISOString(),
		};

		try {
			let html: string;
			if (useCache && fs.existsSync(filePath)) {
				html = fs.readFileSync(filePath, "utf8");
			} else {
				const response = await axios.get<string>(url, {
					headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
					responseType: "text",
					timeout: 30000,
				});
				html = response.data;
				fs.writeFileSync(filePath, html);
			}

			const parsed = parseHobbyGamesScenarioCardCount(html);
			const title = extractHtmlTitle(html) ?? base.title;

			pages.push({
				...base,
				title,
				hobbyGamesCount: parsed?.count ?? null,
				hobbyGamesText: parsed?.text ?? null,
				fetchedAt: new Date().toISOString(),
			});

			if (!parsed) {
				showWarning(`no scenario card count on ${product.slug}`);
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			showWarning(`fetch ${product.slug}: ${message}`);
			pages.push({ ...base, error: message });
		}
	}

	const withCount = pages.filter((page) => page.hobbyGamesCount != null).length;
	writeHobbyGamesValidationJson(HOBBY_GAMES_PAGES_FILE, pages);
	showSuccess(
		`Hobby pages ready — ${withCount}/${pages.length} counts parsed → ${HOBBY_GAMES_PAGES_FILE}.json`,
	);

	if (withCount === 0) {
		showError("no Hobby Games counts parsed");
	}

	return pages;
};
