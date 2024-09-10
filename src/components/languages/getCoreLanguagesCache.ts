import { loadTranslationLanguages } from "@/api/arkhamDB/api";

export const getCoreLanguagesCache = async () => {
  console.log('getting available encounter set languages...');
  return await loadTranslationLanguages();
} 