import { 
  buildFromCache, 
  createCache, 
  createDatabaseCache,
  createTranslationsCache,
  createIconFont,
  createIconsCache,
} from "./jobs";

export class App {
  async run(command?: string) {
    console.log('starting application');

    switch (command) {
      case 'translations':
        return await createTranslationsCache();
      case 'database':
        return await createDatabaseCache();
      case 'cache':
        return await createCache();
      case 'icons':
        return await createIconsCache();
      case 'font':
        return await createIconFont();
      case 'build':
        return await buildFromCache();
    }

    await createCache();
    await createIconFont();
    await buildFromCache();
  }
}