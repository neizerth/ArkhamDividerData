import * as ArkhamCards from '@/components/arkhamCards/translations';

export const getEncounterSetTranslatios = async (language: string) => {
  return await ArkhamCards.getEncounterSetTranslations(language);
}