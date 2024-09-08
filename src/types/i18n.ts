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

