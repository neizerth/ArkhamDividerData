import { getEncountersFromCache, getEncountersSetsFromCache, getIconMappingFromCache } from "../../util/cache";
import { IArkhamDB } from "../../types/arkhamDB";
import { CacheType } from "../../types/cache";
import { Mapping } from "../../types/common";
import { IDatabase } from "../../types/database";
import { cache } from "../../util/cache";

export const cacheDatabaseEncounterSets = () => {
  console.log('caching database encounter sets...');
  const encounterSets = getEncounterSets();

  cache(CacheType.DATABASE_ENCOUNTER_SETS, encounterSets);
}

type IEncounterSetEntries = [string, string][]

export const getEncounterSets = () => {
  const arkhamDBEncounters = getEncountersFromCache();
  const arkhamCardsEncounters = getEncountersSetsFromCache();
  const iconMapping = getIconMappingFromCache();
  
  const encounterSets: IEncounterSetEntries = Object.entries(arkhamCardsEncounters);

  return arkhamDBEncounters.map(
    linkArkhamCardsEncounterSet({
      encounterSets,
      iconMapping
    })
  );
}

type ILinkArkhamCardsEncounterSet = {
  encounterSets: IEncounterSetEntries
  iconMapping: Mapping
}

export const linkArkhamCardsEncounterSet = ({ encounterSets, iconMapping }: ILinkArkhamCardsEncounterSet) => 
  (encounter: IArkhamDB.JSON.ExtendedEncounter): IDatabase.EncounterSet => {
    const encounterSet = encounterSets.find(
      ([_, name]) => name.toLowerCase() === encounter.name.toLowerCase()
    );
    const { code } = encounter;
    const encounterIcon = iconMapping[code] || code;
    
    if (!encounterSet) {
      console.log(`encounter code "${code}" not found`)
      return {
        ...encounter,
        icon: encounterIcon
      };
    }

    const [arkhamDBCode] = encounterSet;

    return {
      ...encounter,
      icon: iconMapping[arkhamDBCode] || encounterIcon,
      arkhamdb_code: arkhamDBCode
    };
  }