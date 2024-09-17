import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';
import * as Cache from '@/util/cache';
export const getSideCampaign = () => {
  const fullCampaigns = Cache.getCampaigns();

  return fullCampaigns.find(({ campaign }) => campaign.id === SIDE_STORIES_CODE)
}