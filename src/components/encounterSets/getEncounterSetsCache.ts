import { loadEncounterSets } from "../../api/arkhamCards/api";

export const getEncounterSetsCache = () => loadEncounterSets('en');