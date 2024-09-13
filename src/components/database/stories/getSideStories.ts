import { createIconDB } from "@/components/arkhamCards/icons/IconDB";
import { IDatabase } from "@/types/database";
import * as Cache from '@/util/cache';
import { showError, showSuccess, showWarning } from "@/util/console";
import { without_size_support } from '@/data/arkhamCards/packs.json'

import { isNotNil, prop, propEq } from "ramda";
import { getSideCampaign } from "@/components/arkhamCards/scenarios/getSideCampaign";
import { SingleValue } from "@/types/common";

const withoutSizeSupport = without_size_support as string[];

export const getSideStories = (): IDatabase.Story[] => {
  const packs = Cache.getPacks();
  const scenarioEncounterSets = Cache.getScenarioEncounterSets();
  const sideScenarios = Cache.getSideScenarios();

  const sideCampaign = getSideCampaign();

  if (!sideCampaign) {
    showError('side campaign not found');
    return [];
  }

  const { scenarios, campaign } = sideCampaign;

  const iconDB = createIconDB();

  return scenarios
    .map(scenario => {
      const link = sideScenarios.find(propEq(scenario.id, 'scenario_id'));
      
      if (!link) {
        showError(`link not found: ${scenario.id}`);
        return;
      }

      const { pack_code } = link;

      const pack = packs.find(propEq(pack_code, 'code'));

      if (!pack) {
        showError(`pack scenario not found: ${scenario.id}`)
      }
      
      const scenarioEncounters = scenarioEncounterSets.filter(
        propEq(pack_code, 'pack_code')
      );

      const requiredEncounters = scenarioEncounters.filter(
        propEq(false, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const extraEncounters = scenarioEncounters.filter(
        propEq(true, 'is_extra')
      )
      .map(prop('encounter_set_code'));

      const name = pack?.name || scenario.scenario_name;
      
      const {
        is_official,
        is_canonical,
        code = scenario.id,
      } = pack || {} as SingleValue<typeof packs>;

      const isSizeSupported = is_official && 
        is_canonical && 
        !withoutSizeSupport.includes(code);

      const icon = iconDB.getIcon(code);
      const type = scenario.side_scenario_type || IDatabase.StoryType.SIDE;
      const packCodes = pack ? [pack.code] : [];

      return {
        name,
        code,
        icon,
        type,
        pack_codes: packCodes,
        campaigns: [campaign.id],
        custom_content: scenario.custom,
        is_size_supported: Boolean(isSizeSupported),
        is_canonical,
        is_official,
        encounter_sets: requiredEncounters,
        extra_encounter_sets: extraEncounters
      }
    })
    .filter(isNotNil)
}