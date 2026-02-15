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
	},
	scenarios,
	encounterSets,
	icons,
});
