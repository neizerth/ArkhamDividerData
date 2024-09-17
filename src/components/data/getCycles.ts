
import * as ArkhamCards from "@/components/arkhamCards";
import * as ArkhamDB from "@/components/arkhamDB";
import { delay } from "@/util/common";
import { groupBy, isNotNil, mergeAll, prop, values } from "ramda";

export const getCycles = async () => {
  const data = [];

  console.log('loading ArkhamDB cycles...');
  data.push(...await ArkhamDB.getCycles());

  await delay(200);

  console.log('loading Arkham Cards cycles...');
  data.push(...await ArkhamCards.getCycles());

  const groups = groupBy(prop('code'), data);

  return values(groups)
    .filter(isNotNil)
    .map(mergeAll);
}