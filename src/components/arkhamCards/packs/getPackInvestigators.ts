import * as ArkhamCards from '@/api/arkhamCards/api';
import type { IArkhamDB } from '@/types/arkhamDB';
import { ICache } from "@/types/cache";
import * as Cache from '@/util/cache';
import { pick, propEq } from 'ramda';

const pickInvestigatorProps = pick([
  'code',
  'alternate_of',
  'position',
  'pack_code',
  'faction_code',
  'name',
  'real_name'
])


export const getPackInvestigators = async (): Promise<ICache.PackInvestigator[]> => {
  const packs = Cache.getPacks();
  const investigators = await Cache.getInvestigators();

  const arkhamCardsPacks = packs.filter(
    propEq(ICache.Source.ARKHAM_CARDS, 'source')
  );

  const data = [];
  for (const pack of arkhamCardsPacks) {
    const localInvestigators = await getInvestigators(pack);
    
    const graphQLInvestigators = await getGraphQLInvestigators({
      pack,
      investigators,
      localInvestigators
    });

    data.push(...localInvestigators, ...graphQLInvestigators)
  }

  return data;
}

const getGraphQLInvestigators = async ({
  pack,
  localInvestigators,
  investigators
}: {
  pack: ICache.Pack;
  localInvestigators: ICache.PackInvestigator[];
  investigators: IArkhamDB.API.Investigator[];
}): Promise<ICache.PackInvestigator[]> => {
  return investigators.filter(
    propEq(pack.code, 'pack_code')
  ).filter(
    ({ code }) => !localInvestigators.some(propEq(code, 'code'))
  ).map(investigator => ({
    cycle_code: pack.cycle_code,
    ...pickInvestigatorProps(investigator)
  }));
}

const getInvestigators = async (pack: ICache.Pack): Promise<ICache.PackInvestigator[]> => {
  console.log(`loading pack ${pack.cycle_code}/${pack.code} cards...`);
  const { cycle_code } = pack;
  const cards = await ArkhamCards.loadJSONPackCards(pack.code)

  const investigators = cards
    .filter(
      propEq('investigator', 'type_code')
    ) as never as IArkhamDB.API.Investigator[];

  return investigators.map(investigator => ({
    cycle_code,
    ...pickInvestigatorProps(investigator)
  }));
}