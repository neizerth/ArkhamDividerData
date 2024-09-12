import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError } from "@/util/console";
import { without_size_support as withoutSizeSupport } from '@/data/arkhamCards/cycles.json'
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { isNotNil, prop, propEq, uniq } from "ramda";

import * as ArkhamDBConstants from "@/api/arkhamDB/constants";
import * as ArkhamCardsConstants from "@/api/arkhamCards/constants";


const CAMPAIGN_SKIP_CYCLE_CODES = [
  ...ArkhamDBConstants.SPECIAL_CAMPAIGN_TYPES,
  ...ArkhamCardsConstants.SPECIAL_CAMPAIGN_TYPES
];

export const getCycleStories = (): IDatabase.Story[] => {
  const fullCampaigns = Cache.getCampaigns();
  const cycles = Cache.getCycles();
  const packs = Cache.getPacks();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const scenarioEncounterSets = Cache.getScenarioEncounterSets();
  const packEncounters = Cache.getPackEncounterSets();
  const iconDB = createIconDB();

  return cycles.filter(({
    is_official,
    code
  }) => {
    if (CAMPAIGN_SKIP_CYCLE_CODES.includes(code)) {
      return false;
    }
    if (!is_official) {
      return false;
    }

    const encounters = encounterSets.filter(
      ({ cycle_code }) => cycle_code === code
    );

    return encounters.length > 0;
  })
  .map(({
    code,
    name,
    is_canonical,
    is_official
  }) => {
    const cycleEncounters = scenarioEncounterSets.filter(
      propEq(code, 'cycle_code')
    );

    if (cycleEncounters.length === 0) {
      showError(`cycle encounters not found: ${code}`);
      return;
    }

    const campaignsIds = uniq(
      cycleEncounters.map(prop('campaign_id'))
    );

    const campaigns = fullCampaigns.filter(
      ({ campaign }) => campaignsIds.includes(campaign.id)
    );

    const requiredEncounters = [];
    const extraEncounters = [];

    if (campaigns.length === 0) {
      showError(`campaigns not found: ${code}`);

      const campaignEncounters = packEncounters.filter(
          propEq(code, 'cycle_code')
        )
        .map(prop('encounter_set_code'));
      
      requiredEncounters.push(
        ...campaignEncounters
      );
    }
    else {
      const toEncounterCode = prop('encounter_set_code');

      const filterEncounters = (required: boolean) => uniq(
        cycleEncounters.filter(
          propEq(!required, 'is_extra')
        )
        .map(toEncounterCode)
      )
      
      requiredEncounters.push(
        ...filterEncounters(true)
      )
      extraEncounters.push(
        ...filterEncounters(false)
      );
    }

    const cyclePacks = packs.filter((pack) => {
      if (code !== pack.cycle_code) {
        return false;
      }
      const packEncounters = encounterSets.filter(
        ({ pack_code }) => pack_code === pack.code
      );
      return packEncounters.length > 0;
    });

    if (cyclePacks.length === 0) {
      showError(`cycle packs not found: ${code}`);
      return;
    }
    const [fullCampaign] = campaigns;

    const isSizeSupported = is_official && !withoutSizeSupport.includes(code);

    const type = fullCampaign?.campaign.campaign_type || IDatabase.StoryType.CAMPAIGN;
    const custom_content = fullCampaign?.campaign.custom;

    const icon = iconDB.getIcon(code);

    // const returnPackCodes = returnPacks.filter()

    return {
      name,
      code,
      icon,
      type,
      cycle_code: code,
      is_canonical,
      is_official,
      custom_content,
      campaigns: campaignsIds,
      pack_codes: cyclePacks.map(prop('code')),
      is_size_supported: isSizeSupported,
      encounter_sets: requiredEncounters,
      extra_encounter_sets: extraEncounters
    }
  })
  .filter(isNotNil);
}