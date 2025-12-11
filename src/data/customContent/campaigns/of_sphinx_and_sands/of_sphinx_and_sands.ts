import { createCustomContent } from "@/components/custom/createCustomContent";
import scenarios from "./scenarios.json";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "of_sphinx_and_sands",
		type: "side_campaign",
		name: "Of Sphinx and Sands",
		custom_content: {
			creators: [
				{
					name: "M M (Mat628)",
					link: "https://boardgamegeek.com/profile/Mat628",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://arkhamcentral.com/of-sphinx-and-sands-arkham-horror-lcg-adventure/",
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
