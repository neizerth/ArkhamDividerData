type Pack = {
  pack_code: string
  scenario_id?: string
  is_size_supported?: boolean
  add_encounter_sets?: string[]
}

const packs: Pack[] = [
  {
    "pack_code": "blbe",
    "scenario_id": "blob_that_ate_everything_else",
    "is_size_supported": true
  },
  {
    "pack_code": "zcos",
    "scenario_id": "the_colour_out_of_space",
    "is_size_supported": true
  },
  {
    "pack_code": "blob",
    "add_encounter_sets": [
      "blob_epic_multiplayer"
    ]
  },
  {
    "pack_code": "guardians",
    "add_encounter_sets": [
      "the_nights_usurper",
      "abyssal_gifts"
    ]
  }
]

export default packs;