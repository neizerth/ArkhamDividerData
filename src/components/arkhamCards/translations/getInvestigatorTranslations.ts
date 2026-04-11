import * as ArkhamCards from '@/api/arkhamCards/api';
import type { IArkhamDB } from '@/types/arkhamDB';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { createPropTranslator } from '@/util/common';
import { showWarning } from '@/util/console';
import { isNotNil, pick, prop, propEq, uniq } from 'ramda';

export const getInvestigatorTranslations = async (language: string) => {
  const packs = Cache.getPacks();

  const packInvestigators = Cache.getPackInvestigators();
  const packCodes = uniq(packInvestigators.map(
    prop('pack_code')
  ));

  const arkhamCardsPacks = packs.filter(
    propEq(ICache.Source.ARKHAM_CARDS, 'source')
  );
  const data = {};

  for (const pack of arkhamCardsPacks) {
    if (!packCodes.includes(pack.code)) {
      showWarning(`no investigators in pack ${pack.code}, skip`);
      continue;
    }
    Object.assign(data, await getInvestigators(pack, language));
  }

  return data;
} 

export const getInvestigators = async (pack: ICache.Pack, language: string) => {
  const { cycle_code } = pack;
  console.log(`loading investigators pack ${language}/${pack.code} cards...`);

  const packInvestigators = Cache.getPackInvestigators();
  
  const onlyProps = pick([
    'code',
    'name',
    'real_name',
    'subname'
  ]);
  
  const baseInvestigators = packInvestigators
    .filter(propEq(pack.code, 'pack_code'))
    .map(onlyProps)

  const cards = await ArkhamCards.loadLocalJSONPackCards(pack.code, language) as IArkhamDB.API.Investigator[];

  const mappings = baseInvestigators
    .map(baseInvestigator => {
      const { code } = baseInvestigator;
      
      const investigator = cards.find(
        (investigator) => investigator.alternate_of === code
      );

      if (!investigator) {
        showWarning(`local investigator ${baseInvestigator.name}/${baseInvestigator.code} not found`);
        return null;
      }

      const localInvestigator = {
        cycle_code,
        ...investigator,
      }

      const translateProps = createPropTranslator(
        baseInvestigator, 
        localInvestigator
      );

      return translateProps([
        'name',
        'real_name',
        'subname',
      ])
    })
    .filter(isNotNil)

  return Object.assign({}, ...mappings);
}
