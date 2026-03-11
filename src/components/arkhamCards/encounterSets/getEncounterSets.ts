import * as API from "@/api/arkhamCards/api";
import type { ICache } from "@/types/cache";
import { filterEncounterSet } from "@/util/criteria";

export const getEncounterSets = async (): Promise<ICache.EncounterSet[]> => {
	const data = await API.loadJSONEncounterSets();

	return data
		.map((encounter) => ({
			...encounter,
			synonyms: [],
		}))
		.filter(({ code }) => filterEncounterSet(code));
};
