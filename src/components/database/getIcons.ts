import type { ICache } from "@/types/cache";
import type { IDatabase } from "@/types/database";
import * as Cache from "@/util/cache";
import {
	buildEncounterSetCodeByIcon,
	buildStoryIconIndex,
} from "./stories/util/getStoryIcons";

export const getIcons = (): IDatabase.Icon[] => {
	const cachedIcons = Cache.getIconInfo();
	const encounterSets = Cache.getDatabaseEncounterSets();
	const stories = Cache.getStories();
	const storyByIcon = buildStoryIconIndex(stories, encounterSets);
	const encounterSetCodeByIcon = buildEncounterSetCodeByIcon(encounterSets);

	return cachedIcons.map((icon) =>
		mapDatabaseIcon({
			icon,
			storyByIcon,
			encounterSetCodeByIcon,
		}),
	);
};

export const mapDatabaseIcon = ({
	icon,
	storyByIcon,
	encounterSetCodeByIcon,
}: {
	icon: ICache.IconInfo;
	storyByIcon: Map<string, { pack_code?: string; cycle_code?: string }>;
	encounterSetCodeByIcon: Map<string, string>;
}): IDatabase.Icon => {
	const story = storyByIcon.get(icon.icon);

	return {
		...icon,
		pack_code: story?.pack_code,
		cycle_code: story?.cycle_code,
		encounter_set_code: encounterSetCodeByIcon.get(icon.icon),
	};
};
