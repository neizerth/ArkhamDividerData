import { customContent } from '@/data/customContent';
import * as Cache from '@/util/cache';
import { prop } from 'ramda';

export const getCustomContent = () => {
  const stories = Cache.getStories();

  const storyNames = stories.map(prop('name'));

  return Object.values(customContent)
    .filter(
      ({ story }) => !storyNames.includes(story.name)
    );
}