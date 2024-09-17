import { loadTranslationLanguages } from "@/api/arkhamDB/api";

export const getCoreLanguages = async () => {
  return await loadTranslationLanguages();
} 