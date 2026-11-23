import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "last_christmas",
		type: "side_story",
		name: "Last Christmas",
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
							link: "https://mysteriouschanting.wordpress.com/2025/12/12/last-christmas/",
						},
					],
				},
			],
		},
	},
	encounterSets: [
		{
			code: "last_christmas",
			name: "Last Christmas",
			size: 9,
			types: [
				{ type: "scenario", size: 1 },
				{ type: "agenda", size: 2 },
				{ type: "act", size: 1 },
				{ type: "location", size: 1 },
				{ type: "asset", size: 4 },
			],
		},
	],
	icons: [
		{
			icon: "last_christmas",
			width: 1024,
			height: 825,
		},
	],
});
