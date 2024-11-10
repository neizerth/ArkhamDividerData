import * as ArkhamDB from '@/components/arkhamDB/translations';
import * as ArkhamCards from '@/components/arkhamCards/translations';


export const getInvestigatorTranslations = async (language: string) => {
  console.log('getting ArkhamDB investigator translations...');
  const adb = await ArkhamDB.getInvestigatorTranslations(language);

  console.log('getting Arkham Cards investigator translations...');
  const ac = await ArkhamCards.getInvestigatorTranslations(language);
  
  return {
    ...adb,
    ...ac
  };
} 