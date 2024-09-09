import { getEncountersFromCache, getEncountersSetsFromCache } from "@/util/cache";
import { IArkhamDB } from "@/types/arkhamDB";
import { CacheType } from "@/types/cache";
import { IDatabase } from "@/types/database";
import { cache } from "@/util/cache";
import { createIconDB, IIconDB } from "@/components/icons/IconDB";
import { Mapping } from "@/types/common";

export const cacheDatabaseEncounterSets = () => {
  console.log('caching database encounter sets...');
  const encounterSets = getEncounterSets();

  cache(CacheType.DATABASE_ENCOUNTER_SETS, encounterSets);
}

export const getEncounterSets = () => {
  const arkhamDBEncounters = getEncountersFromCache();
  // const campaigns = 
  const arkhamCardsEncounters = getEncountersSetsFromCache();
  const iconDB = createIconDB();

  return linkEncounterSets({
    arkhamDBEncounters,
    arkhamCardsEncounters,
    iconDB
  })
  
}

type ILinkEncounterSet = {
  arkhamDBEncounters: IArkhamDB.JSON.ExtendedEncounter[]
  arkhamCardsEncounters: Mapping
  iconDB: IIconDB
}

export const linkEncounterSets = ({ 
  arkhamCardsEncounters, 
  arkhamDBEncounters,
  iconDB
}: ILinkEncounterSet): IDatabase.EncounterSet[] => 
  Object.entries(arkhamCardsEncounters)
  .map((arkhamCardsEnrty) => {
    const [arkhamCardsId, arkhamCardsName] = arkhamCardsEnrty;
    const arkhamDBEncounter = arkhamDBEncounters.find(
      ({ name }) => name.toLowerCase() === arkhamCardsName.toLowerCase()
    );
    
    if (!arkhamDBEncounter) {
      console.log(`arkhamDB encounter not found: ${arkhamCardsId}`);
      return {
        name: arkhamCardsName,
        code: arkhamCardsId
      }
    }
    const icon = iconDB.getId(arkhamDBEncounter.code) || iconDB.getId(arkhamCardsId);
    return {
      ...arkhamDBEncounter,
      code: arkhamCardsId,
      arkhamdb_code: arkhamDBEncounter.code,
      icon
    }
  })
