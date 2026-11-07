import { createCustomContent } from "@/components/custom/createCustomContent";

const midnightMasks = {
	code: "arkham",
	size: 5,
	full_size: 20,
	types: [
		{
			type: "treachery",
			size: 5,
			cards: {
				135: 3,
				136: 2,
			},
		},
	],
};

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "sanitarium",
		type: "side_story",
		name: "Sanitarium",
		is_size_supported: true,
		encounter_set_data: [midnightMasks],
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
							link: "https://arkhamcentral.com/sanitarium/",
						},
					],
				},
			],
		},
	},
	scenarios: [
		{
			id: "sanitarium",
			scenario_name: "Sanitarium",
			extra_encounter_sets: [
				"chilling_cold",
				"locked_doors",
				"pentagram",
				"striking_fear",
				"arkham",
			],
			encounter_set_data: [midnightMasks],
		},
	],
	encounterSets: [
		{
			code: "sanitarium",
			name: "Sanitarium",
			size: 67,
			types: [
				{ type: "scenario", size: 1 },
				{ type: "agenda", size: 7 },
				{ type: "act", size: 6 },
				{ type: "location", size: 10 },
				{ type: "enemy", size: 15 },
				{ type: "asset", size: 10 },
				{ type: "treachery", size: 9 },
				{ type: "story", size: 9 },
			],
		},
	],
	icons: [
		{
			icon: "sanitarium",
			width: 671,
			height: 849,
		},
	],
});
