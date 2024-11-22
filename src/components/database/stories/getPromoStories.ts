import { IDatabase } from "@/types/database"
import * as Cache from '@/util/cache';
import { propEq } from "ramda";

export const getPromoStories = (): IDatabase.Story[] => {

  const packInvestigators = Cache.getPackInvestigators();
  const investigators = packInvestigators.filter(
    propEq('promotional', 'cycle_code')
  );

  return [
    {
      name: 'Promotional',
      code: 'promo',
      type: 'promo',
      icon: 'book',
      encounter_sets: [],
      extra_encounter_sets: [],
      scenario_encounter_sets: [],
      is_size_supported: false,
      investigators
    }
  ]
}