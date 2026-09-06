import * as ArkhamDB from '@/components/arkhamDB/translations';
import * as ArkhamCards from '@/components/arkhamCards/translations';
import * as ArkhamBuild from '@/components/arkhamBuild/translations';


export const getInvestigatorTranslations = async (language: string) => {
  console.log('getting ArkhamDB investigator translations...');
  const adb = await ArkhamDB.getInvestigatorTranslations(language);

  console.log('getting Arkham Cards investigator translations...');
  const ac = await ArkhamCards.getInvestigatorTranslations(language);

  console.log('getting Arkham Build investigator translations...');
  const ab = await ArkhamBuild.getInvestigatorTranslations(language);
  
  return {
    ...adb,
    ...ac,
    ...ab,
  };
} 