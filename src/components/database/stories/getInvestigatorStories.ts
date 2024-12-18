import { IDatabase } from "@/types/database"
import * as Cache from '@/util/cache';
import { propEq } from "ramda";

export const getInvestigatorStories = (): IDatabase.Story[] => {

  const packInvestigators = Cache.getPackInvestigators();
  const investigators = packInvestigators.filter(
    propEq('investigator', 'cycle_code')
  );

  return [
    {
      name: 'Investigator Starter Decks',
      code: 'investigator',
      type: 'investigator',
      icon: 'investigator',
      encounter_sets: [],
      extra_encounter_sets: [],
      scenario_encounter_sets: [],
      is_size_supported: false,
      investigators
    }
  ]
}