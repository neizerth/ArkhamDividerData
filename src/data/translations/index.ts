import * as side from './side';
import * as campaigns from './campaigns';
import { createTranslationBundle } from '@/components/translations/createTranslationBundle';
import type { LanguageStoryTranslation } from '@/types/i18n';
import type { Mapping } from '@/types/common';

const sources = [
  campaigns,
  side
] as unknown as Mapping<LanguageStoryTranslation>[];

const translations = createTranslationBundle(sources)

export default translations;