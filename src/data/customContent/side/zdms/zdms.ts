import { createCustomContent } from "@/components/custom/createCustomContent";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "zdms",
		type: "side_story",
		name: "Dark Matter: Science Expansion",
	},
	encounterSets: [
		{
			name: "Dark Matter: Science Expansion",
			code: "cards",
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
