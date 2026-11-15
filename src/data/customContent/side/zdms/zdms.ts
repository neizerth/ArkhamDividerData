import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "zdms",
		type: "side_story",
		name: "Dark Matter: Science Expansion",
		custom_content: {
			creators: [
				{
					name: "Axolotl",
				},
			],
			download_links: [
				{
					language: "ru",
					links: [
						{
							link: "https://disk.yandex.ru/d/If2zxNhdu5w0iQ",
							translated_by: [
								{
									name: "@Renegat_693",
									link: "https://t.me/Renegat_693",
								},
								{
									name: "@gigabytesergey",
									link: "https://t.me/gigabytesergey",
								},
							],
						},
					],
				},
			],
		},
	},
	scenarios: false,
	encounterSets: [
		{
			name: "Purchasable Science Cards",
			code: "cards",
		},
		{
			name: "Researched Story Assets",
			code: "zdms",
		},
	],
	icons: [
		{
			icon: "zdms",
			width: 204,
			height: 203,
		},
		{
			icon: "cards",
			width: 179,
			height: 178,
			circled: true,
		},
	],
});
