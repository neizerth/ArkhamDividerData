import type { IDatabase } from "@/types/database"
import * as Cache from '@/util/cache';
import { propEq } from "ramda";

export const getInvestigatorStories = (): IDatabase.Story[] => {

  const packInvestigators = Cache.getPackInvestigators();
  const packs = Cache.getPacks();
  const fullCampaigns = Cache.getCampaigns();

  const starterInvestigators = packInvestigators.filter(
    propEq('investigator', 'cycle_code')
  );

  const fanMadeCategories = packs.filter(
    propEq('zinv', 'cycle_code')
  );

  const parallelCategories = packs.filter(
    propEq('parallel', 'cycle_code')
  );

  return [
    {
      name: 'Investigator Starter Decks',
      code: 'starter-decks',
      type: 'investigators',
      icon: 'investigator',
      encounter_sets: [],
      extra_encounter_sets: [],
      scenario_encounter_sets: [],
      is_size_supported: false,
      is_official: true,
      is_canonical: true,
      investigators: starterInvestigators
    },
    ...fanMadeCategories.map(({ code, name }) => ({
      name,
      code,
      type: 'investigators',
      icon: 'investigator',
      encounter_sets: [],
      extra_encounter_sets: [],
      scenario_encounter_sets: [],
      is_size_supported: false,
      is_canonical: false,
      is_official: false,
      investigators: packInvestigators.filter(
        propEq(code, 'pack_code')
      )
    })),
    ...parallelCategories.map(({ code, name}) => ({
      name,
      code,
      type: 'challenge',
      icon: 'parallel',
      encounter_sets: [],
      extra_encounter_sets: [],
      scenario_encounter_sets: [],
      is_size_supported: false,
      is_canonical: false,
      is_official: false,
      investigators: packInvestigators.filter(
        propEq(code, 'pack_code')
      )
    }))
  ]
}