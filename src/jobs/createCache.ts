import { cacheArkhamCards } from "./cacheArkhamCards";
import { cacheArkhamDB } from "./cacheArkhamDB";
import { cacheDatabase } from "./cacheDatabase/cacheDatabase";
import { cacheLanguages } from "./cacheLanguages";
import { cacheTranslations } from "./cacheTranslations/cacheTranslations";

export const createCache = async () => {
  console.log('starting cache creating...');
  await cacheArkhamDB();
  await cacheArkhamCards();
  
  await cacheDatabase();

  await cacheLanguages();
  await cacheTranslations();
}