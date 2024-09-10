import { getCustomPacksFromCache, getEncountersFromCache, getEncountersSetsFromCache } from "@/util/cache";
import { IArkhamDB } from "@/types/arkhamDB";
import { CacheType } from "@/types/cache";
import { IDatabase } from "@/types/database";
import { cache } from "@/util/cache";
import { createIconDB, IIconDB } from "@/components/icons/IconDB";
import { IArkhamCards } from "@/types/arkhamCards";
import { propEq } from "ramda";

export const cacheDatabaseEncounterSets = () => {
  console.log('caching database encounter sets...');
  const encounterSets = getEncounterSets();

  cache(CacheType.DATABASE_ENCOUNTER_SETS, encounterSets);
}

export const getEncounterSets = () => {
  const arkhamDBEncounters = getEncountersFromCache();
  const arkhamCardsEncounters = getEncountersSetsFromCache();
  const customPacks = getCustomPacksFromCache();
  const iconDB = createIconDB();

  return linkEncounterSets({
    arkhamDBEncounters,
    arkhamCardsEncounters,
    customPacks,
    iconDB
  })
  
}

type ILinkEncounterSet = {
  arkhamDBEncounters: IArkhamDB.JSON.ExtendedEncounter[]
  arkhamCardsEncounters: IArkhamCards.EncounterSet[]
  customPacks: IArkhamCards.JSON.ExtendedPack[]
  iconDB: IIconDB
}

export const linkEncounterSets = ({ 
  arkhamCardsEncounters, 
  arkhamDBEncounters,
  customPacks,
  iconDB
}: ILinkEncounterSet): IDatabase.EncounterSet[] => arkhamCardsEncounters
  .map((arkhamCardsSet) => {
    const arkhamDBEncounter = arkhamDBEncounters.find(
      ({ name }) => name.toLowerCase() === arkhamCardsSet.name.toLowerCase()
    );
    const arkhamCardsIcon = iconDB.getId(arkhamCardsSet.code)
    
    if (!arkhamDBEncounter) {
      console.log(`arkhamDB encounter not found: ${arkhamCardsSet.code}`);
      const customPack = customPacks.find(propEq(arkhamCardsSet.code, 'code')) || {};

      return {
        ...arkhamCardsSet,
        ...customPack,
        is_custom: true,
        icon: arkhamCardsIcon
      }
    }
    const icon = iconDB.getId(arkhamDBEncounter.code) || arkhamCardsIcon;
    return {
      ...arkhamDBEncounter,
      ...arkhamCardsSet,
      arkhamdb_code: arkhamDBEncounter.code,
      icon,
      is_custom: false
    }
  })
