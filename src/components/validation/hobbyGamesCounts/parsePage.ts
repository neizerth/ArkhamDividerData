/**
 * Parse Hobby Games product description for scenario/encounter card totals.
 * Prefers phrases like "133 карты сценария" / "350 карт сценариев".
 */
export const parseHobbyGamesScenarioCardCount = (
	html: string,
): { count: number; text: string } | null => {
	const decoded = html
		.replace(/&nbsp;/gi, " ")
		.replace(/&thinsp;|&#8201;/gi, " ")
		.replace(/\s+/g, " ");

	const patterns: RegExp[] = [
		/(\d{2,4})\s*карт(?:ы|а|у)?\s+сценари[а-яё]*/gi,
		/(\d{2,4})\s*карт(?:ы|а|у)?(?=\s*[<\n,.])/gi,
	];

	for (const pattern of patterns) {
		const matches = [...decoded.matchAll(pattern)];
		for (const match of matches) {
			const raw = match[0]?.trim();
			const count = Number(match[1]);
			if (!raw || !Number.isFinite(count)) {
				continue;
			}
			// Skip catalogue noise like "15 карточных настолок".
			if (/карточных/i.test(raw)) {
				continue;
			}
			// Skip protector advice ("357шт") — already excluded by pattern, keep range sane.
			if (count < 20 || count > 800) {
				continue;
			}
			return { count, text: raw };
		}
	}

	return null;
};

export const extractHtmlTitle = (html: string): string | null => {
	const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
	if (!match?.[1]) {
		return null;
	}
	return (
		match[1]
			.replace(/<[^>]+>/g, "")
			.replace(/\s+/g, " ")
			.trim() || null
	);
};
