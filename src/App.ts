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
    }
    // await cacheDatabase();
    // await cacheArkhamDB();
    // await cacheArkhamCards();
    
    // const availableLanguages = 
    // const campaignEn = 

    // this.cache('encounterSet', getEncounterSetsCache);
    // getEncounterSetsCache();
  }
}