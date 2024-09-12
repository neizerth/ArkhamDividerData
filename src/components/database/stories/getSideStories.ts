import { CUSTOM_SCENARIO_CODE, NON_CANONICAL_CODE, SIDE_STORIES_CODE } from "@/api/arkhamCards/constants";
import { SPECIAL_CAMPAIGN_TYPES } from "@/api/arkhamDB/constants";
import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError, showSuccess, showWarning } from "@/util/console";
import { without_size_support } from '@/data/arkhamCards/packs.json'

import { isNotNil, propEq } from "ramda";

const SIDE_CODES = [
  ...SPECIAL_CAMPAIGN_TYPES,
  NON_CANONICAL_CODE,
  CUSTOM_SCENARIO_CODE
];

const withoutSizeSupport = without_size_support as string[];

export const getSideStories = (): IDatabase.Story[] => {
  const packs = Cache.getPacks();
  const fullCampaigns = Cache.getCampaigns();
  const encounterSets = Cache.getDatabaseEncounterSets();
  const scenarioEncounterSets = Cache.getScenarioEncounterSets();
  const sideCampaign = fullCampaigns.find(({ campaign }) => campaign.id === SIDE_STORIES_CODE)
  
  if (!sideCampaign) {
    showError('side campaign not found');
    return [];
  }

  const { scenarios, campaign } = sideCampaign;

  const iconDB = createIconDB();

  const findPack = (code: string) => {
    const packByCode = packs.find(
      propEq(code, 'code')
    );

    if (packByCode) {
      return packByCode;
    }

    showWarning(`pack not found by code: ${code}`);

    const encounterSet = encounterSets.find(encounter => 
      encounter.pack_code && 
      encounter.code === code
    );

    if (encounterSet) {
      showSuccess('found in encounters!');
      const pack = packs.find(propEq(encounterSet.pack_code, 'code'));

      if (pack) {
        return pack;
      }
      showWarning(`encounter set pack not found: ${code}`);
    }

    

    return;
  }

  return scenarios
    .map(scenario => {
    
      const pack = findPack(scenario.id);

      if (!pack) {
        showError(`pack scenario not found: ${scenario.id}`)
        return;
      }

      const {
        is_official,
        is_canonical,
        code,
        name
      } = pack;

      const isSizeSupported = is_official && 
        is_canonical && 
        !withoutSizeSupport.includes(code);

      const icon = iconDB.getIcon(code);
      const type = scenario.side_scenario_type || IDatabase.StoryType.SIDE;

      return {
        name,
        code,
        icon,
        type,
        pack_codes: [code],
        campaigns: [campaign.id],
        is_size_supported: isSizeSupported,
        is_canonical,
        is_official,
        encounter_sets: [],
        extra_encounter_sets: []
      }
    })
    .filter(isNotNil)
}