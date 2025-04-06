import * as API from '@/api/arkhamDB/api';
import type { IArkhamDB } from '@/types/arkhamDB';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { groupBy, prop, toPairs, propEq, uniq, isNotNil } from 'ramda';

export const getPackEncounterSets = async (): Promise<ICache.PackEncounterSet[]> => {
  const packs = Cache.getPacks();
  const arkhamDBPacks = packs.filter(
    propEq(ICache.Source.ARKHAMDB, 'source')
  );

  const data = [];
  for (const pack of arkhamDBPacks) {
    data.push(...await getEncounterSets(pack))
  }

  return data;
}

const getEncounterSets = async (pack: ICache.Pack) => {
  console.log(`loading pack ${pack.cycle_code}/${pack.code} cards...`);
  const {
    code,
    cycle_code
  } = pack;

  const encounterCards = await API.loadJSONPackEncounterCards(cycle_code, code);
  const packCards = await API.loadJSONPackCards(cycle_code, code);

  const cards = [...encounterCards, ...packCards];

  const encounters = cards.filter(
    ({ encounter_code }) => Boolean(encounter_code)
  );

  const groups = groupBy(prop('encounter_code'), encounters);

  return toPairs(groups)
    .map(([encounter_set_code, cards = []]) => {
      const types = getEncounterSetTypes(cards);
      const size = types.reduce(
        (total, { size }) => total + size,
        0
      )
      return {
        pack_code: code,
        cycle_code,
        source: ICache.Source.ARKHAMDB,
        encounter_set_code,
        size,
        types
      }
    });
}

export const getEncounterSetTypes = (cards: IArkhamDB.JSON.Card[]) => {
  const types = uniq(
    cards
      .map(prop('type_code'))
      .filter(isNotNil)
  );

  const mainTypes = ['agenda', 'act', 'scenario'];
  const mainTypeCards = cards.filter(
      ({ type_code }) => mainTypes.includes(type_code)
    )
    .map(prop('position'));

  return types
    .map(type => {
      const typeCards = cards.filter(propEq(type, 'type_code'));

      const size = typeCards
        .filter(({ position, type_code }) => 
          mainTypes.includes(type_code) || 
          !mainTypeCards.includes(position)
        )
        .reduce(
          (total, { quantity }) => total + quantity,
          0
        )

      const cardCodes = typeCards.map(prop('position'));

      return {
        type,
        size,
        cards: cardCodes
      };
    })
}