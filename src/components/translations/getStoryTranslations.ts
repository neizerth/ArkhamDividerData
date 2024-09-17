import * as ArkhamCards from '@/components/arkhamCards/translations';

export const getCampaignStoryTranslations = async (language: string) => {
  return await ArkhamCards.getCampaignTranslations(language);
}

// export const