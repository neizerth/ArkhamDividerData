export namespace IArkhamDB {
  export type HasSets<T> = {
    sets: T[]
  }
  export type HasReturnSet<T> = {
    return_set_code?: T;
  }

  export type HasPosition = {
    position: number
  }

  export type HasSize = {
    size: number
  }

  export type HasCycleCode = {
    cycle_code: string
  }

  export type HasCode = {
    code: string
  }

  export type HasUrl = {
    url: string
  }

  export type HasName = {
    name: string
  }

  export type HasPackCode = {
    pack_code: string
  }

  export namespace API {
    export type Entity = HasCode & HasUrl & HasName;

    export type Pack = Entity & HasPosition & {
      cycle_position?: number
      available?: string
      known?: number
      total?: number
      id?: number
    }

    export type Card = HasName & HasPosition & HasPackCode & {
      faction_code: string
      encounter_position?: number
      encounter_code?: string
    }
  }
  export namespace Web {
    export type Entity = HasCode & HasUrl & HasName;

    export type Cycle = Entity;
    export type Set = Entity;

    export type ExtendedCycle = Cycle & 
      HasReturnSet<string> & 
      HasSets<Set>;
  }
  export namespace JSON {
    export type Entity = HasCode & HasName;

    export type Cycle = Entity & HasPosition & HasSize;
    export type ExtendedCycle = Cycle & HasReturnSet<string>;

    export type Pack = Entity & HasPosition & HasSize & HasCycleCode & {
      cgdb_id: number
      date_release: string
    }
    export type ExtendedPack = Pack & {
      encounter_codes: string[]
    };

    export type Encounter = Entity;
    export type ExtendedEncounter = Encounter & HasPackCode & HasCycleCode;
  }
}
