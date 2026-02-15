import { createCustomContent } from "@/components/custom/createCustomContent";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";
import scenarios from "./scenarios.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "souls_of_darkness",
		type: "side_campaign",
		name: "Souls of Darkness",
	},
	scenarios,
	encounterSets,
	icons,
});
