import { 
  cacheArkhamCards, 
  cacheArkhamDB, 
  build, 
  buildFromCache, 
  cacheLanguages, 
  cacheTranslations, 
  createCache, 
  createDatabaseCache
} from "./jobs";

export class App {
  async run(command?: string) {
    console.log('starting application');

    switch (command) {
      case 'database':
        return await createDatabaseCache();
      case 'arkham-db':
        return await cacheArkhamDB();
      case 'arkham-cards':
        return await cacheArkhamCards();
      case 'languages':
        return await cacheLanguages();
      case 'i18n':
        return await cacheTranslations();
      case 'create-cache':
        return await createCache();
      case 'build-from-cache':
        return await buildFromCache();
      default:
        return await build();
    }
  }
}