import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "the_phantom_of_the_opera",
		type: "side_story",
		name: "The Phantom of the Opera",
		is_size_supported: true,
		custom_content: {
			creators: [
				{
					name: "The Beard",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://mysteriouschanting.wordpress.com/2024/10/01/the-phantom-of-the-opera/",
						},
					],
				},
			],
		},
	},
	encounterSets: [
		{
			code: "the_phantom_of_the_opera",
			name: "The Phantom of the Opera",
			size: 66,
		},
	],
	icons: [
		{
			icon: "the_phantom_of_the_opera",
			width: 564,
			height: 584,
		},
	],
});
