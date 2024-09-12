import * as API from '@/api/arkhamDB/api';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { delay } from '@/util/common';
import { groupBy, identity, isNotNil, prop, toPairs, propEq } from 'ramda';

export const getPackEncounterSets = async (): Promise<ICache.PackEncounterSet[]> => {
  const packs = Cache.getPacks();
  const arkhamDBPacks = packs.filter(
    propEq(ICache.Source.ARKHAMDB, 'source')
  );

  const data = [];
  for (const pack of arkhamDBPacks) {
    await delay(200);
    data.push(...await getEncounterSets(pack))
  }

  return data;
}

const getEncounterSets = async (pack: ICache.Pack) => {
  console.log(`loading pack ${pack.code} cards...`);
  const {
    code,
    cycle_code
  } = pack;

  const cards = await API.loadPackCards(code);

  const codes = cards
    .map(prop('encounter_code'))
    .filter(isNotNil);

  const groups = groupBy(identity, codes);

  return toPairs(groups)
    .map(([encounter_set_code, group = []]) => {
      return {
        pack_code: code,
        cycle_code,
        source: ICache.Source.ARKHAMDB,
        encounter_set_code,
        size: group.length
      }
    });
}