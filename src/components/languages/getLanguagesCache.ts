import { loadTranslationLanguages } from "../../api/arkhamCards/api"

export const getLanguagesCache = async () => {
  console.log('getting available languages...')
  return await loadTranslationLanguages();
}