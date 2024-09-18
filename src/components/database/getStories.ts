import { IDatabase } from "@/types/database";
import { getCycleStories } from "./stories/getCycleStories";
import { getSideScenarioStories } from "./stories/getSideScenarioStories";
import { getSpecialStories } from "./stories/getSpecialStories";
import { getSideCampaignStories } from "./stories/getSideCampaignsStories";
import { prop, uniqBy } from "ramda";

export const getStories = (): IDatabase.Story[] => {
  const data = [];

  console.log('caching cycle stories...');
  data.push(...getCycleStories());

  console.log('caching side scenario stories...');
  data.push(...getSideScenarioStories());

  console.log('caching side campaign stories...');
  data.push(...getSideCampaignStories());

  console.log('caching special stories...');
  data.push(...getSpecialStories());

  return uniqBy(prop('code'), data);
}
