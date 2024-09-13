import * as ArkhamCards from "@/api/arkhamCards/constants";
import * as ArkhamDB from "@/api/arkhamDB/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { SingleValue } from "@/types/common";
import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError, showWarning } from "@/util/console";
import { isNotNil, prop, propEq } from "ramda";

const CAMPAIGN_CODES = [
  ArkhamCards.CUSTOM_CAMPAIGN_CODE,
  ArkhamCards.CUSTOM_SCENARIO_CODE,
  ArkhamDB.PROMOTIONAL_CODE,
  ArkhamDB.RETURN_CYCLE_CODE
]

export const getPackCampaignStories = (): IDatabase.Story[] => {
  const packs = Cache.getPacks();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const campaignLinks = Cache.getCampaignLinks();
  const fullCampaigns = Cache.getCampaigns();
  const iconDB = createIconDB();
  const sideScenarios = Cache.getSideScenarios();

  const sidePackCodes = sideScenarios.map(prop('pack_code'));

  const getReturnToCode = (code: string) => {
    const returnToCode = code.slice(0, 2);
    if (returnToCode !== ArkhamDB.RETURN_CYCLE_PREFIX) {
      return;
    }
    
    const pack = packs.find(propEq(returnToCode, 'code'));

    return pack?.code;
  }

  return packs
    .filter(({ cycle_code, code }) => {
      if (!CAMPAIGN_CODES.includes(cycle_code)) {
        return false;
      }
      if (sidePackCodes.includes(code)) {
        return false;
      }
      const encounters = encounterSets.filter(
        ({ pack_code }) => pack_code === code 
      )

      return encounters.length > 0;
    })
    .map(({ 
      name, 
      code, 
      is_canonical,
      is_official
    }) => {
      const links = campaignLinks.filter(
        ({ pack_code }) => pack_code === code
      );

      if (links.length === 0) {
        showWarning(`links not found: ${code}`);
      }

      const campaignIds = links.map(prop('campaign_id'));

      const campaigns = fullCampaigns.filter(
        ({ campaign }) => campaignIds.includes(campaign.id) 
      );

      if (campaigns.length === 0) {
        showError(`campaigns not found: ${code}`);
      }

      const campaign = campaigns[0]?.campaign || {} as SingleValue<typeof campaigns>['campaign'];
      const { 
        campaign_type,
        custom
      } = campaign;

      const icon = iconDB.getIcon(code);

      const isSizeSupported = is_official && is_canonical;
      const type = campaign_type || IDatabase.StoryType.CAMPAIGN;

      const story = {
        name,
        icon,
        code,
        campaigns: campaignIds,
        pack_codes: [code],
        type,
        encounter_sets: [],
        extra_encounter_sets: [],
        custom_content: custom,
        return_to_code: getReturnToCode(code),
        is_size_supported: isSizeSupported,
        is_canonical,
        is_official
      }

      return {
        ...story
      };
    })
    .filter(isNotNil);
}