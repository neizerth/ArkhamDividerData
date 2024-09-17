import * as API from '@/api/arkhamDB/api';
import { IArkhamDB } from '@/types/arkhamDB';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { delay } from '@/util/common';
import { groupBy, prop, toPairs, propEq } from 'ramda';

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

  const encounters = cards.filter(
    ({ encounter_code }) => Boolean(encounter_code)
  ) as IArkhamDB.JSON.EncounterCard[];

  const groups = groupBy(prop('encounter_code'), encounters);

  return toPairs(groups)
    .map(([encounter_set_code, cards = []]) => {
      const size = cards.reduce(
        (total, { quantity }) => total + quantity,
        0
      )
      return {
        pack_code: code,
        cycle_code,
        source: ICache.Source.ARKHAMDB,
        encounter_set_code,
        size
      }
    });
}