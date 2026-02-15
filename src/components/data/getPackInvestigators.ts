import type { ICache } from "@/types/cache";
import * as ArkhamCards from "@/components/arkhamCards";
import * as ArkhamDB from "@/components/arkhamDB";

/*
  Gets encounter sets per pack
  Due to Arkham Cards hasn't all encounters we can't take this data 
*/
export const getPackInvestigators = async (): Promise<
	ICache.PackInvestigator[]
> => {
	const data = [];

	console.log("loading ArkhamDB pack investigators...");
	data.push(...(await ArkhamDB.getPackInvestigators()));

	console.log("loading Arkham Cards pack investigators...");
	data.push(...(await ArkhamCards.getPackInvestigators()));

	return data;
};
