import { SIDE_STORIES_CODE } from '@/api/arkhamCards/constants';
import type { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { showError } from '@/util/console';
import { prop, propEq } from 'ramda';
import { arkham_db_mapping as packsMapping } from '@/data/arkhamCards/cycles.json';
import type { IArkhamCards } from '@/types/arkhamCards';


export const getCampaignLinks = (): ICache.CampaignLink[] => {

  const packs = Cache.getPacks(); 
  const campaigns = Cache.getCampaigns()
  .filter(({ campaign }) => campaign.id !== SIDE_STORIES_CODE);

  const findCampaignPacks = ({ id, name }: IArkhamCards.JSON.Campaign) => {
    const packsByCode = packs.filter(propEq(id, 'code'));
    if (packsByCode.length > 0) {
      return packsByCode;
    }
    const cyclePacks = packs.filter(propEq(id, 'cycle_code'));

    if (cyclePacks.length > 0) {
      return cyclePacks;
    }

    const packsByName = packs.filter(propEq(name, 'name'));
    
    if (packsByName.length > 0) {
      return packsByName;
    }

    const mappingPackCodes = packsMapping
      .filter(propEq(id, 'campaign_id'))
      .map(prop('pack_code'));
    
    if (mappingPackCodes.length > 0) {
      return packs.filter(({ code }) => mappingPackCodes.includes(code));
    }

    return [] as ICache.Pack[];
  }

  return campaigns
    .flatMap(({ campaign }) => {
      const packs = findCampaignPacks(campaign);

      if (packs.length === 0) {
        showError(`pack for campaign not found: ${campaign.id}`);
      }
      
      return packs.map(({ 
        code, 
        cycle_code 
      }) => {
        return {
          campaign_id: campaign.id,
          pack_code: code,
          cycle_code
        }
      })
    });
}