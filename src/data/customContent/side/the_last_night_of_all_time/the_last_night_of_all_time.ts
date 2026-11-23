import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "the_last_night_of_all_time",
		type: "side_story",
		name: "The Last Night of All Time",
		is_size_supported: true,
		custom_content: {
			creators: [
				{
					name: "Frankç+",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://mysteriouschanting.wordpress.com/2026/10/24/the-last-night-of-all-time/",
						},
					],
				},
			],
		},
	},
	encounterSets: [
		{
			code: "the_last_night_of_all_time",
			name: "The Last Night of All Time",
			size: 92,
			types: [
				{ type: "scenario", size: 1 },
				{ type: "agenda", size: 3 },
				{ type: "act", size: 4 },
				{ type: "story", size: 1 },
				{ type: "location", size: 26 },
				{ type: "asset", size: 2 },
				{ type: "enemy", size: 17 },
				{ type: "treachery", size: 38 },
			],
		},
	],
	icons: [
		{
			icon: "the_last_night_of_all_time",
			width: 1010,
			height: 1024,
			circled: true,
		},
	],
});
