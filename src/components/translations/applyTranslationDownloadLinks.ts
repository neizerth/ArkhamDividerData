import translations from "@/data/translations";
import type { IDatabase } from "@/types/database";

type DownloadLinkGroup = IDatabase.CustomContent["download_links"][number];

/**
 * Merge download_links from src/data/translations onto stories.
 * Applies at build time so JSON link updates work without recreating the stories cache.
 */
export const applyTranslationDownloadLinks = (
	stories: IDatabase.Story[],
): IDatabase.Story[] => {
	return stories.map((story) => {
		const groups = new Map<string, DownloadLinkGroup>();

		for (const group of story.custom_content?.download_links ?? []) {
			groups.set(group.language, {
				language: group.language,
				links: [...group.links],
			});
		}

		let changed = false;

		for (const [language, bundle] of Object.entries(translations)) {
			const customLinks = bundle.download_links?.[story.code];
			if (!customLinks?.length) {
				continue;
			}

			const translatedBy = bundle.translated_by?.[story.code];
			const links = customLinks.map((item) => ({
				...item,
				...(translatedBy ? { translated_by: translatedBy } : {}),
			}));

			const existing = groups.get(language);
			if (existing) {
				const known = new Set(existing.links.map((l) => l.link));
				for (const link of links) {
					if (!known.has(link.link)) {
						existing.links.push(link);
						changed = true;
					}
				}
			} else {
				groups.set(language, { language, links });
				changed = true;
			}
		}

		if (!changed) {
			return story;
		}

		return {
			...story,
			custom_content: {
				creators: story.custom_content?.creators ?? [],
				download_links: [...groups.values()],
			},
		};
	});
};
