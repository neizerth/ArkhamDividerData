export namespace IIcoMoon {
  export type Icon = {
    name: string;
    campaign: string;
  }
  
  export type IconSetItem = {
    id: number;
    paths: string[];
    attrs?: Object[];
    width?: number;
    grid: number;
    tags: string[];
  };
  
  export type SelectionItem = {
    order: 0;
    id: number;
    name: string;
    prevSize: number;
    code: number;
    tempChar: string;
  };
  
  export type IconSet = {
    selection: SelectionItem[];
    id: number;
    metadata: {
      name: string,
      importSize: {
        width: number,
        height: number
      }
    },
    height: number,
    prevSize: number,
    icons: IconSetItem[]
  }
  
  export type Project = {
    metadata: {
      name: string,
      lastOpened: number,
      c: number,
    },
    iconSets: IconSet[]
  }
}

