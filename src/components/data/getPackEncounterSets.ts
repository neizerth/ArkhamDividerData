import * as ArkhamBuild from '@/components/arkhamBuild';
import * as ArkhamCards from '@/components/arkhamCards';
import * as ArkhamDB from '@/components/arkhamDB';
import type { ICache } from '@/types/cache';

const encounterKey = ({
  pack_code,
  encounter_set_code,
}: Pick<ICache.PackEncounterSet, 'pack_code' | 'encounter_set_code'>) =>
  `${pack_code}::${encounter_set_code}`;

const needsSize = (entry: ICache.PackEncounterSet) =>
  entry.size === undefined || entry.size === 0;

/**
 * Prefer ArkhamDB / Arkham Cards rows; fill missing or zero sizes from arkham.build.
 * Encounter sets that exist only in arkham.build are appended.
 */
export const mergePackEncounterSets = (
  primary: ICache.PackEncounterSet[],
  fallback: ICache.PackEncounterSet[],
): ICache.PackEncounterSet[] => {
  const byKey = new Map(
    primary.map((entry) => [encounterKey(entry), entry] as const),
  );

  for (const entry of fallback) {
    const key = encounterKey(entry);
    const current = byKey.get(key);

    if (!current) {
      byKey.set(key, entry);
      continue;
    }

    if (!needsSize(current) || !entry.size) {
      continue;
    }

    byKey.set(key, {
      ...current,
      size: entry.size,
      types: entry.types ?? current.types,
    });
  }

  return [...byKey.values()];
};

/*
  Gets encounter sets per pack
  Due to Arkham Cards hasn't all encounters we can't take this data 
*/
export const getPackEncounterSets = async (): Promise<ICache.PackEncounterSet[]> => {
  const data: ICache.PackEncounterSet[] = [];

  console.log('loading ArkhamDB pack encounter sets...');
  data.push(...await ArkhamDB.getPackEncounterSets());

  console.log('loading Arkham Cards pack encounter sets...');
  data.push(...await ArkhamCards.getPackEncounterSets());

  console.log('loading Arkham Build pack encounter sets (size fallback)...');
  const build = await ArkhamBuild.getPackEncounterSets();

  return mergePackEncounterSets(data, build);
}
