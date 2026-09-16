import type { IDatabase } from '@/types/database';
import * as ArkhamCards from '@/components/arkhamCards/database'
import * as ArkhamDB from '@/components/arkhamDB/database';
import { groupBy, isNotNil, prop, values } from 'ramda';

const sizeOf = (entry: Pick<IDatabase.EncounterSet, 'size'>) => entry.size ?? 0;

/** Merge encounter-set rows; keep the larger size (and its types) when both have one. */
const mergeEncounterSetGroup = (
  entries: IDatabase.EncounterSet[],
): IDatabase.EncounterSet =>
  entries.reduce((acc, entry) => {
    const merged = { ...acc, ...entry };

    if (sizeOf(acc) > sizeOf(entry)) {
      merged.size = acc.size;
      merged.types = acc.types ?? entry.types;
    } else if (sizeOf(entry) > sizeOf(acc)) {
      merged.size = entry.size;
      merged.types = entry.types ?? acc.types;
    }

    return merged;
  });

/*
  pack_code and cycle_code linking to encounter sets
  ArkhamDB: just find right PackEncounterSets entities
  ArkhamCards: append rest of data and exclude encounters with already set pack_code
*/
export const getEncounterSets = (): IDatabase.EncounterSet[] => {
  const data = [];

  console.log('caching Arkham Cards database encounter sets...');
  data.push(...ArkhamCards.getEncounterSets());

  console.log('caching ArkhamDB database encounter sets...');
  data.push(...ArkhamDB.getEncounterSets());

  const groups = groupBy(prop('code'), data);

  const groupValues = values(groups).filter(isNotNil);
  return groupValues.map(mergeEncounterSetGroup);
}