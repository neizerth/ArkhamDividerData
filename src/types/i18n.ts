import { Mapping } from "./common";
import { IDatabase } from "./database";

export namespace IPOEditor {
  export type Translation = {
    msgid: string;
    msgstr: string[]
  }
  
  export type Source = {
    charset: string;
    headers: {
        [index: string]: string;
    }
    translations: {
        '': {
            [index: string]: Translation
        }
    }
  }
}

export type StoryTranslation = {
  common: Mapping
  translations: Mapping
  translated_by?: IDatabase.CustomContentTranslator[]
}

export type LanguageStoryTranslation = Mapping<StoryTranslation>;