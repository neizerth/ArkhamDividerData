import * as API from '@/api/arkhamDB/api';
import { IArkhamDB } from '@/types/arkhamDB';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { delay } from '@/util/common';
import { propEq } from 'ramda';

export const getPackInvestigators = async (): Promise<ICache.PackInvestigator[]> => {
  const packs = Cache.getPacks();
  const arkhamDBPacks = packs.filter(
    propEq(ICache.Source.ARKHAMDB, 'source')
  );

  const data = [];
  for (const pack of arkhamDBPacks) {
    await delay(200);
    data.push(...await getInvestigators(pack))
  }

  return data;
}

const getInvestigators = async (pack: ICache.Pack) => {
  console.log(`loading pack ${pack.code} cards...`);
  const {
    code,
    cycle_code
  } = pack;

  const cards = await API.loadPackCards(code);

  const investigators = cards.filter(
    propEq('investigator', 'type_code')
  ) as IArkhamDB.API.Investigator[];

  return investigators.map(({
    code,
    pack_code,
    faction_code,
    name,
    real_name,
    subname,
    traits,
    real_traits,
    flavor
  }) => {
    return {
      code,
      cycle_code,
      pack_code,
      faction_code,
      name,
      real_name,
      subname,
      traits,
      real_traits,
      flavor,
    }
  })
}
