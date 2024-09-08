import { cacheArkhamCards, cacheArkhamDB, cacheDatabase } from "./jobs";
import { cacheLanguages } from "./jobs/cacheLanguages";
import { cacheTranslations } from "./jobs/cacheTranslations/cacheTranslations";

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
      case 'all':
        return await this.all();
      default:
        return console.log(`${type} is not supported`);
    }
  }
  async all() {
    await cacheArkhamCards();
    await cacheArkhamDB();
    await cacheDatabase();
    await cacheLanguages();
  }
}