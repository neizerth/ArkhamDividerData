import type { IDatabase } from "@/types/database";

export const checkScenario = ({ 
  id, 
  type, 
  encounter_sets = [] 
}: IDatabase.StoryScenario) => {
  return type !== 'interlude' || encounter_sets.includes(id);
}