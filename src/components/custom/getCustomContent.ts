import { customContent } from "@/data/customContent";
import * as Cache from "@/util/cache";
import { showWarning } from "@/util/console";

export const getCustomContent = () => {
	const stories = Cache.getStories();

	const customData = Object.values(customContent);

	return customData.filter(({ story }) => {
		const existingStory = stories.find(
			({ name, type }) => name === story.name && type === story.type,
		);
		if (existingStory) {
			showWarning(
				`Custom content: story ${existingStory.name}/${existingStory.type} already exists`,
			);
		}
		return !existingStory;
	});
};
