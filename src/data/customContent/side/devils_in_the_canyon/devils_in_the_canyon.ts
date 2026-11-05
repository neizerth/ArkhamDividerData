import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "devils_in_the_canyon",
		type: "side_story",
		name: "Devils in the Canyon",
		custom_content: {
			creators: [
				{
					name: "marvinsweddinggown",
					link: "https://mysteriouschanting.wordpress.com/author/marvinsweddinggown/",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://mysteriouschanting.wordpress.com/2025/12/01/devils-in-the-canyon-standalone-scenario/",
						},
					],
				},
			],
		},
	},
	scenarios: [
		{
			id: "devils_in_the_canyon",
			icon: "devils_in_the_canyon_set",
			scenario_name: "Devils in the Canyon",
		},
	],
	encounterSets: [
		{
			code: "brynes_expedition",
			name: "Bryne's Expedition",
		},
		{
			code: "watchful_eye",
			name: "Watchful Eye",
		},
		{
			code: "canyon_protector",
			name: "Canyon Protector",
		},
	],
	icons: [
		{
			icon: "devils_in_the_canyon",
			width: 328,
			height: 347,
		},
		{
			icon: "devils_in_the_canyon_set",
			width: 249,
			height: 244,
		},
		{
			icon: "brynes_expedition",
			width: 224,
			height: 194,
		},
		{
			icon: "watchful_eye",
			width: 154,
			height: 234,
		},
		{
			icon: "canyon_protector",
			width: 248,
			height: 244,
		},
	],
});
