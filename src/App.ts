import { cacheArkhamCards, cacheArkhamDB, cacheDatabase } from "./jobs";

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
  }
}