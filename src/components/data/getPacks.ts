import * as ArkhamCards from '@/components/arkhamCards';
import * as ArkhamDB from '@/components/arkhamDB';
import { groupBy, isNotNil, mergeAll, prop, values } from 'ramda';


export const getPacks = async () => {
  const data = [];

  console.log('loading Arkham Cards packs...');
  data.push(...await ArkhamCards.getPacks());

  console.log('loading ArkhamDB packs...');
  data.push(...await ArkhamDB.getPacks());

  const groups = groupBy(prop('code'), data);

  return values(groups)
    .filter(isNotNil)
    .map(mergeAll);
}