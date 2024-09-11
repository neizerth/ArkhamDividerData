import * as ArkhamDB from '@/components/arkhamDB';
import * as ArkhamCards from '@/components/arkhamCards' 
import { groupBy, isNotNil, mergeAll, prop, values } from 'ramda';


export const getEncounterSets = async () => {
  const data = [];
  console.log('loading Arkham Cards encounter sets...');
  data.push(...await ArkhamCards.getEncounterSets());

  console.log('loading ArkhamDB encounter sets...');
  data.push(...await ArkhamDB.getEncounterSets());

  const groups = groupBy(prop('code'), data);

  return values(groups)
    .filter(isNotNil)
    .map(mergeAll);
}