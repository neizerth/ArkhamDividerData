import * as ArkhamCards from '@/api/arkhamCards/api';
import * as Cache from '@/util/cache'
import { ICache } from "@/types/cache"
import { isNotNil, prop, propEq } from 'ramda';
import { delay } from '@/util/common';

export const getPackEncounterSets = async (): Promise<ICache.PackEncounterSet[]> => {
  const packs = Cache.getPacks();

  const arkhamDBPacks = packs.filter(
    propEq(ICache.Source.ARKHAM_CARDS, 'source')
  );

  const data = [];
  for (const pack of arkhamDBPacks) {
    await delay(200);
    data.push(...await getEncounterSets(pack))
  }

  return data;
}

const getEncounterSets = async (pack: ICache.Pack): Promise<ICache.PackEncounterSet[]> => {
  console.log(`loading pack ${pack.code} cards...`);
  const cards = await ArkhamCards.loadJSONPackCards(pack.code);

  const codes = cards
    .map(prop('encounter_code'))
    .filter(isNotNil);

  return codes.map(encounter_set_code => ({
    cycle_code: pack.cycle_code,
    pack_code: pack.code,
    source: pack.source,
    encounter_set_code
  }))
}