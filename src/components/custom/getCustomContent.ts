import { customContent } from "@/data/customContent";
import * as Cache from "@/util/cache";
import { showWarning } from "@/util/console";

export const getCustomContent = () => {
	const stories = Cache.getStories();

	const customData = Object.values(customContent);

	return customData.filter((customStory) => {
		const existingStory = stories.find(
			(story) =>
				story.name === customStory.story.name &&
				story.type === customStory.story.type,
		);
		if (existingStory) {
			showWarning(
				`Custom content: story ${customStory.story.name}/${existingStory.type} already exists`,
			);
		}
		return !existingStory;
	});
};
