
import { IDatabase } from "@/types/database";
import { getCycleStories } from "./stories/getCycleStories";
import { getSideStories } from "./stories/getSideStories";
import { getCustomCampaignStories } from "./stories/getCustomCampaignStories";

export const getStories = (): IDatabase.Story[] => {
  const data = [];

  console.log('caching cycle stories...')
  data.push(...getCycleStories());

  console.log('caching side stories...')
  data.push(...getSideStories());

  console.log('caching custom campaign stories...')
  data.push(...getCustomCampaignStories());

  return data;
}

