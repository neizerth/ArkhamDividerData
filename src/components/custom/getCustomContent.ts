import { customContent } from "@/data/customContent";
import * as Cache from "@/util/cache";
import { showWarning } from "@/util/console";

export const getCustomContent = () => {
	const stories = Cache.getStories();

	const customData = Object.values(customContent);

	return customData.filter((customStory) => {
		const exists = stories.filter(
			(story) =>
				story.name === customStory.story.name &&
				story.type === customStory.story.type,
		);
		if (exists) {
			showWarning(
				`Custom content: story ${customStory.story.name} already exists`,
			);
		}
		return !exists;
	});
};
