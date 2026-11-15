import { createCustomContent } from "@/components/custom/createCustomContent";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";
import scenarios from "./scenarios.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "night_of_vespers",
		type: "side_campaign",
		name: "Night of Vespers",
		custom_content: {
			creators: [
				{
					name: "Exhaled Innards",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://mysteriouschanting.wordpress.com/2024/12/17/night-of-vespers/",
						},
					],
				},
				{
					language: "ru",
					links: [
						{
							link: "https://drive.google.com/drive/folders/1-IdNotTvTE9ZTSj0OwUCLL8didhSsbHw?usp=sharing",
							translated_by: [
								{
									name: "@darkfakke",
									link: "https://t.me/darkfakke",
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
