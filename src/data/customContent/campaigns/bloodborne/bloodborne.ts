import { createCustomContent } from "@/components/custom/createCustomContent";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";
import scenarios from "./scenarios.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "bloodborne",
		type: "side_campaign",
		name: "Bloodborne: The City of the Unseen",
		custom_content: {
			creators: [
				{
					name: "exhaled innards",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://mysteriouschanting.wordpress.com/2024/02/18/bloodborne-the-city-of-the-unseen/",
						},
					],
				},
				{
					language: "ru",
					links: [
						{
							link: "https://disk.yandex.ru/d/9Jr40TdBT2miIg",
							translated_by: [
								{
									name: "@Renegat_693",
									link: "https://t.me/Renegat_693",
								},
							],
						},
					],
				},
			],
		},
	},
	scenarios,
	encounterSets,
	icons,
});
