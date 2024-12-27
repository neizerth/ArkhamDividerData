import * as ArkhamDB from '@/api/arkhamDB/api';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { createPropTranslator } from '@/util/common';
import { isNotNil, pick, prop, propEq, uniq } from 'ramda';

export const getInvestigatorTranslations = async (language: string) => {
  const packs = Cache.getPacks();
  const languages = Cache.getCoreLanguages();

  const packInvestigators = Cache.getPackInvestigators();
  const packCodes = uniq(packInvestigators.map(
    prop('pack_code')
  ));

  if (!languages.includes(language)) {
    return {};
  }

  const arkhamDBPacks = packs.filter(
    propEq(ICache.Source.ARKHAMDB, 'source')
  );
  const data = {};

  for (const pack of arkhamDBPacks) {
    if (!packCodes.includes(pack.code)) {
      continue;
    }
    Object.assign(data, await getInvestigators(pack, language));
  }

  return data;
} 

export const getInvestigators = async (pack: ICache.Pack, language: string) => {
  const { cycle_code } = pack;
  console.log(`loading pack ${language}/${pack.code} cards...`);
  const onlyProps = pick([
    'code',
    'name',
    'real_name',
    'subname',
    'traits',
    'real_traits',
    'flavor'
  ])
  const packInvestigators = Cache.getPackInvestigators();
  
  const baseInvestigators = packInvestigators
    .filter(propEq(pack.code, 'pack_code'))
    .map(onlyProps);

  const cards = await ArkhamDB.loadLocalPackCards(pack.cycle_code, pack.code, language);

  const mappings = cards
    .map(card => {
      const { code } = card;

      const baseInvestigator = baseInvestigators.find(
        propEq(code, 'code')
      );

      if (!baseInvestigator) {
        return;
      }

      const localInvestigator = {
        cycle_code,
        ...card,
      }

      const translateProps = createPropTranslator(
        baseInvestigator, 
        localInvestigator
      );

      return translateProps([
        'name',
        'real_name',
        'subname',
        'traits',
        'real_traits',
        'flavor'
      ])
    })
    .filter(isNotNil)

  return Object.assign({}, ...mappings);
}