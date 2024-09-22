import * as ArkhamDB from '@/api/arkhamDB/api';
import { IArkhamDB } from '@/types/arkhamDB';
import { ICache } from '@/types/cache';
import * as Cache from '@/util/cache';
import { delay, createPropTranslator } from '@/util/common';
import { showError } from '@/util/console';
import { isNotNil, prop, propEq, uniq } from 'ramda';

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
    await delay(200);
    Object.assign(data, await getInvestigators(pack, language));
  }

  return data;
} 

export const getInvestigators = async (pack: ICache.Pack, language: string) => {
  const { cycle_code } = pack;
  console.log(`loading pack ${language}/${pack.code} cards...`);
  const packInvestigators = Cache.getPackInvestigators();
  
  const baseInvestigators = packInvestigators.filter(
    propEq(pack.code, 'pack_code')
  );

  const cards = await ArkhamDB.loadLocalPackCards(pack.code, language);
  
  const investigators = cards.filter(
    propEq('investigator', 'type_code')
  ) as IArkhamDB.API.Investigator[];

  const mappings = investigators
    .map(investigator => {
      const { code } = investigator;
      const localInvestigator = {
        cycle_code,
        ...investigator,
      }
      const baseInvestigator = baseInvestigators.find(
        propEq(code, 'code')
      );

      if (!baseInvestigator) {
        showError(`investigator ${code} not found`)
        return;
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