export namespace IArkhamDB {
  export type HasSets<T> = {
    sets: T[]
  }
  export type HasReturnSetCode<T> = {
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

  export type HasCode<T = string> = {
    code: T
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

  export type HasEncounterCodes = {
    encounter_codes: string[]
  }

  export type HasCampaignType = {
    campaign_type: CampaignType
  }

  export enum CampaignType {
    PARALLEL = 'parallel',
    SIDE_STORIES = 'side_stories',
    CAMPAIGN = 'campaign'
  }

  export type EncounterSet = HasCode & HasSize;

  export namespace API {
    export type Entity = HasCode & HasUrl & HasName;

    export type Pack = Entity & HasPosition & {
      cycle_position?: number
      available?: string
      known?: number
      total?: number
      id?: number
    }

    export type Card = HasCode & HasName & HasPosition & HasPackCode & {
      faction_code: string
      type_code: string
      encounter_position?: number
      encounter_code?: string
    }

    export type Investigator = Card & {
      name: string;
      real_name?: string;
      subname?: string;
      traits?: string;
      real_traits?: string;
      flavor?: string;
    }
  }
  export namespace Web {
    export type Entity = HasUrl & HasName & HasCode;

    export type Cycle = Entity;
    export type Set = Entity;

    export type ExtendedCycle = Cycle & 
      HasReturnSetCode<string> & 
      HasSets<Set>;
  }
  export namespace JSON {
    export type Entity = HasName & HasCode;

    export type Cycle = Entity & HasPosition & HasSize;
    export type ExtendedCycle = Cycle & 
      HasReturnSetCode<string> & 
      HasEncounterCodes & 
      HasCampaignType & {
      pack_codes: string[];
      is_size_supported: boolean
    }

    export type Pack = Entity & 
      HasPosition & 
      HasSize & 
      HasCycleCode & {
      cgdb_id: number
      date_release: string
    }

    export type PackEncounterSet = HasCode & HasSize & HasPackCode & HasCycleCode;

    export type HasEncounterSets = {
      encounter_sets: PackEncounterSet[];
    }

    export type ExtendedPack = Pack & HasEncounterSets & HasCampaignType & {
      is_custom: boolean
    }

    export type Encounter = Entity;
    export type ExtendedEncounter = Encounter & 
      Partial<HasPackCode> & 
      Partial<HasCycleCode> & 
      Partial<HasSize>;

    export type Card = HasName & HasPosition & HasPackCode & {
      type_code: string;
    }

    export type EncounterCard = Card & {
      faction_code: string
      encounter_position: number
      encounter_code: string
      quantity: number
    }
  }
}
