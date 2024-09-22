import * as ArkhamDB from "@/api/arkhamDB/api";

export const getCoreLanguages = async () => {
  return await ArkhamDB.loadTranslationLanguages();
} 