
import * as ArkhamCards from '@/api/arkhamCards/api'
import { Mapping } from '@/types/common';

export const getCommonTranslations = async (language: string) => {
  const source = await ArkhamCards.loadCoreTranslations(language);

  return Object.values(source.translations[''])
    .reduce((target, { msgid, msgstr }) => {
      if (!msgid) {
        return target;
      }
      const [value] = msgstr;
      if (!value || msgid === value) {
        return target;
      }
      target[msgid] = value;
      return target;
    }, {} as Mapping);
}