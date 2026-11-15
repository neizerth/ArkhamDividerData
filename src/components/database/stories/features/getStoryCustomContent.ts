import translations from "@/data/translations";
import type { IArkhamCards } from "@/types/arkhamCards";
import type { IDatabase } from "@/types/database";

type DownloadLinkGroup = IDatabase.CustomContent["download_links"][number];

export const getStoryCustomContent = ({
	code,
	content,
}: {
	code: string;
	content: IArkhamCards.CustomContent;
}): IDatabase.CustomContent => {
	const { creator } = content;
	const byLanguage = new Map<string, DownloadLinkGroup>();

	for (const [language, link] of Object.entries(content.download_link)) {
		const translatedBy = translations[language]?.translated_by?.[code];
		byLanguage.set(language, {
			language,
			links: [
				{
					link,
					...(translatedBy ? { translated_by: translatedBy } : {}),
				},
			],
		});
	}

	for (const [language, bundle] of Object.entries(translations)) {
		const customLinks = bundle.download_links?.[code];
		if (!customLinks?.length) {
			continue;
		}

		const translatedBy = bundle.translated_by?.[code];
		const links = customLinks.map((item) => ({
			...item,
			...(translatedBy ? { translated_by: translatedBy } : {}),
		}));

		const existing = byLanguage.get(language);
		if (existing) {
			const known = new Set(existing.links.map((l) => l.link));
			for (const link of links) {
				if (!known.has(link.link)) {
					existing.links.push(link);
				}
			}
		} else {
			byLanguage.set(language, { language, links });
		}
	}

	return {
		creators: [
			{
				name: creator,
			},
		],
		download_links: [...byLanguage.values()],
	};
};
