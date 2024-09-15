import { 
  build, 
  buildFromCache, 
  createCache, 
  createDatabaseCache,
  createTranslationsCache
} from "./jobs";

export class App {
  async run(command?: string) {
    console.log('starting application');

    switch (command) {
      case 'i18n':
        return await createTranslationsCache();
      case 'database':
        return await createDatabaseCache();
      case 'create-cache':
        return await createCache();
      case 'build-from-cache':
        return await buildFromCache();
      default:
        return await build();
    }
  }
}