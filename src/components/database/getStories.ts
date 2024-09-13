
import { IDatabase } from "@/types/database";
import { getCycleStories } from "./stories/getCycleStories";
import { getSideStories } from "./stories/getSideStories";
import { getPackCampaignStories } from "./stories/getPackCampaignStories";

export const getStories = (): IDatabase.Story[] => {
  const data = [];

  console.log('caching cycle stories...')
  data.push(...getCycleStories());

  console.log('caching side stories...')
  data.push(...getSideStories());

  console.log('caching pack campaign stories...')
  data.push(...getPackCampaignStories());

  return data;
}

