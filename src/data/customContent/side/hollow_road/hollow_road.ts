import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "hollow_road",
		type: "side_story",
		name: "1203 Hollow Road",
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
							link: "https://mysteriouschanting.wordpress.com/2026/06/25/1203-hollow-road/",
						},
					],
				},
			],
		},
	},
	scenarios: [
		{
			id: "hollow_road",
			icon: "hollow_road_set",
			scenario_name: "1203 Hollow Road",
			size: 27,
			types: [
				{ type: "scenario", size: 1 },
				{ type: "agenda", size: 1 },
				{ type: "act", size: 1 },
				{ type: "location", size: 6 },
				{ type: "enemy", size: 6 },
				{ type: "treachery", size: 12 },
			],
			encounter_sets: [
				"hollow_road",
				"broken_mirror",
				"final_hour",
				"celestial_children",
				"nameless_shadow",
				"vortex",
			],
		},
	],
	encounterSets: [
		{
			code: "broken_mirror",
			name: "Broken Mirror",
			size: 14,
			types: [
				{ type: "story", size: 1 },
				{ type: "asset", size: 3 },
				{ type: "location", size: 2 },
				{ type: "enemy", size: 4 },
				{ type: "treachery", size: 4 },
			],
		},
		{
			code: "final_hour",
			name: "Final Hour",
			size: 15,
			types: [
				{ type: "story", size: 1 },
				{ type: "asset", size: 2 },
				{ type: "location", size: 2 },
				{ type: "enemy", size: 6 },
				{ type: "treachery", size: 4 },
			],
		},
		{
			code: "celestial_children",
			name: "Celestial Children",
			size: 11,
			types: [
				{ type: "story", size: 1 },
				{ type: "enemy", size: 2 },
				{ type: "location", size: 2 },
				{ type: "treachery", size: 6 },
			],
		},
		{
			code: "nameless_shadow",
			name: "Nameless Shadow",
			size: 12,
			types: [
				{ type: "story", size: 1 },
				{ type: "enemy", size: 5 },
				{ type: "location", size: 2 },
				{ type: "treachery", size: 4 },
			],
		},
		{
			code: "vortex",
			name: "Vortex",
			size: 21,
			types: [
				{ type: "story", size: 1 },
				{ type: "scenario", size: 1 },
				{ type: "agenda", size: 1 },
				{ type: "act", size: 1 },
				{ type: "treachery", size: 17 },
			],
		},
	],
	icons: [
		{ icon: "hollow_road", width: 672, height: 1024 },
		{ icon: "hollow_road_set", width: 956, height: 1024 },
		{ icon: "broken_mirror", width: 770, height: 1024 },
		{ icon: "final_hour", width: 1024, height: 1016 },
		{ icon: "celestial_children", width: 1024, height: 848 },
		{ icon: "nameless_shadow", width: 628, height: 1024 },
		{ icon: "vortex", width: 1024, height: 1006 },
	],
});
