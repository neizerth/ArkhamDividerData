import { CUSTOM_CAMPAIGN_CODE, CUSTOM_SCENARIO_CODE, NON_CANONICAL_CODE } from "@/api/arkhamCards/constants";
import { SPECIAL_CAMPAIGN_TYPES } from "@/api/arkhamDB/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError } from "@/util/console";
import { isNotNil } from "ramda";

export const getCustomCampaignStories = () => {
  return [];
}