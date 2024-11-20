import { 
  buildFromCache, 
  createCache, 
  createDatabaseCache,
  createTranslationsCache,
  createIconFont,
  prepareIcons,
  createIconsCache,
  downloadRepos,
} from "./jobs";

import * as app from '@/config/app'

export class App {
  async run(command?: string) {
    console.log('starting application');

    switch (command) {
      case 'env':
        return console.log(app)
      case 'translations':
        return await createTranslationsCache();
      case 'database':
        return await createDatabaseCache();
      case 'cache':
        return await createCache();
      case 'prepare-icons':
        return await prepareIcons();
      case 'cache-icons':
        return await createIconsCache();
      case 'download':
        return await downloadRepos();
      case 'font':
        return await createIconFont();
      case 'build':
        return await buildFromCache();
    }

    await downloadRepos();
    await createCache();
    await createIconFont();
    await buildFromCache();
  }
}