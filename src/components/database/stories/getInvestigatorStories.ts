import { IDatabase } from "@/types/database"
import * as Cache from '@/util/cache';
import { propEq } from "ramda";

export const getInvestigatorStories = (): IDatabase.Story[] => {

  const packInvestigators = Cache.getPackInvestigators();
  const getInvestigatorsByCycle = (cycle_code: string) => 
    packInvestigators.filter(
      propEq(cycle_code, 'cycle_code')
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
      investigators: getInvestigatorsByCycle('investigator')
    },
    {
      name: 'Fan-made Investigators',
      code: 'custom-investigators',
      type: 'investigators',
      icon: 'investigator',
      encounter_sets: [],
      extra_encounter_sets: [],
      scenario_encounter_sets: [],
      is_size_supported: false,
      is_canonical: false,
      is_official: false,
      investigators: getInvestigatorsByCycle('zinv')
    }
  ]
}