import { createCustomContent } from "@/components/custom/createCustomContent";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";
import scenarios from "./scenarios.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "shadows_of_yog_sothoth",
		type: "side_campaign",
		name: "Shadows of Yog-Sothoth",
		is_size_supported: true,
		custom_content: {
			creators: [
				{
					name: "Red_Rob",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://arkhamcentral.com/shadows-of-yog-sothoth-campaign/",
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
