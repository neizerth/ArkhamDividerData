export namespace IDatabase {
  export type Campaign = {
    id: string
    position: number
    version: number
    name: string
    campaign_type: string
    encounter_sets: string[]
  }
}