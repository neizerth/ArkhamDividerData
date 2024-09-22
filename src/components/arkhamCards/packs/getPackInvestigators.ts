import * as ArkhamCards from '@/api/arkhamCards/api';
import * as Cache from '@/util/cache'
import { ICache } from "@/types/cache"
import { propEq } from 'ramda';
import { delay } from '@/util/common';
import { IArkhamDB } from '@/types/arkhamDB';

export const getPackInvestigators = async (): Promise<ICache.PackInvestigator[]> => {
  const packs = Cache.getPacks();

  const arkhamDBPacks = packs.filter(
    propEq(ICache.Source.ARKHAM_CARDS, 'source')
  );

  const data = [];
  for (const pack of arkhamDBPacks) {
    await delay(200);
    data.push(...await getInvestigators(pack))
  }

  return data;
}

const getInvestigators = async (pack: ICache.Pack): Promise<ICache.PackInvestigator[]> => {
  console.log(`loading pack ${pack.code} cards...`);
  const { cycle_code } = pack;
  const cards = await ArkhamCards.loadJSONPackCards(pack.code)

  const investigators = cards
    .filter(
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
  }) => ({
    code,
    cycle_code,
    pack_code,
    faction_code,
    name,
    real_name,
    subname,
    traits,
    real_traits,
    flavor
  }))
}