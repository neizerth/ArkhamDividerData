import { cacheArkhamCards, cacheArkhamDB, cacheDatabase } from "./jobs";
import { build } from "./jobs/build";
import { buildFromCache } from "./jobs/buildFromCache";
import { cacheLanguages } from "./jobs/cacheLanguages";
import { cacheTranslations } from "./jobs/cacheTranslations/cacheTranslations";
import { createCache } from "./jobs/createCache";

export class App {
  async run(type?: string) {
    console.log('starting application');

    switch (type) {
      case 'database':
        return await cacheDatabase();
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