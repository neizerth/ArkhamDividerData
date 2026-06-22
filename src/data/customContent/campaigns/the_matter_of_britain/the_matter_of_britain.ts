import { createCustomContent } from "@/components/custom/createCustomContent";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";
import scenarios from "./scenarios.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "the_matter_of_britain",
		type: "side_campaign",
		name: "The Matter of Britain",
		custom_content: {
			creators: [
				{
					name: "Mark Roberts",
					link: "https://steamcommunity.com/id/FryingTonight",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://www.dropbox.com/scl/fo/hlmht203qmv9yy0ggie70/ABELpeFmLmiV6hUZGuyHz9Q?rlkey=8ta1uhozfmoy39uh643htlubm&st=yrk0rpbh&e=1&dl=0",
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
