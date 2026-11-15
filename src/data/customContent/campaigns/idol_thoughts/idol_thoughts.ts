import { createCustomContent } from "@/components/custom/createCustomContent";
import encounterSets from "./encounterSets.json";
import icons from "./icons.json";
import scenarios from "./scenarios.json";

export default createCustomContent({
	dir: __dirname,
	story: {
		code: "idol_thoughts",
		type: "side_campaign",
		name: "Idol Thoughts",
		is_size_supported: true,
		custom_content: {
			creators: [
				{
					name: "MJGrenier",
				},
			],
			download_links: [
				{
					language: "en",
					links: [
						{
							link: "https://arkhamcentral.com/bread-circuses-fan-created-content-arkham-horror-lcg/",
						},
						{
							link: "https://arkhamcentral.com/cost-of-azure/",
						},
					],
				},
				{
					language: "ru",
					links: [
						{
							link: "https://disk.yandex.ru/d/1YUlRDloQZ7V-g",
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
