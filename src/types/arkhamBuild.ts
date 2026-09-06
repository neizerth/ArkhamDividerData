export namespace IArkhamBuild {
  export type CardsResponse = {
    data: {
      all_card: Card[];
    };
  };

  /** Localized string fields present on non-English card caches. */
  export type LocalizedFields = {
    name?: string;
    text?: string;
    flavor?: string;
    subname?: string;
    traits?: string;
    slot?: string;
    back_name?: string;
    back_text?: string;
    back_flavor?: string;
    back_traits?: string;
    back_subname?: string;
    taboo_text_change?: string;
    customization_text?: string;
    customization_change?: string;
  };

  export type Card = LocalizedFields & {
    code: string;
    id: string;
    pack_code: string;
    position: number;
    quantity: number;
    type_code: string;
    faction_code: string;
    official: boolean;
    exceptional: boolean;
    real_name: string;
    real_text?: string;
    real_flavor?: string;
    real_subname?: string;
    real_traits?: string;
    real_slot?: string;
    real_back_name?: string;
    real_back_text?: string;
    real_back_flavor?: string;
    real_back_traits?: string;
    real_back_subname?: string;
    real_taboo_text_change?: string;
    real_customization_text?: string;
    real_customization_change?: string;
    encounter_code?: string;
    encounter_position?: number;
    illustrator?: string;
    back_illustrator?: string;
    double_sided?: boolean;
    is_unique?: boolean;
    hidden?: boolean;
    permanent?: boolean;
    myriad?: boolean;
    exile?: boolean;
    deck_limit?: number;
    xp?: number;
    cost?: number;
    health?: number;
    sanity?: number;
    clues?: number;
    clues_fixed?: boolean;
    shroud?: number;
    shroud_per_investigator?: boolean;
    doom?: number;
    doom_per_investigator?: boolean;
    stage?: number;
    victory?: number;
    vengeance?: number;
    skill_willpower?: number;
    skill_intellect?: number;
    skill_combat?: number;
    skill_agility?: number;
    skill_wild?: number;
    enemy_fight?: number;
    enemy_evade?: number;
    enemy_damage?: number;
    enemy_horror?: number;
    enemy_fight_per_investigator?: boolean;
    enemy_evade_per_investigator?: boolean;
    health_per_investigator?: boolean;
    heals_damage?: boolean;
    heals_horror?: boolean;
    faction2_code?: string;
    faction3_code?: string;
    subtype_code?: string;
    back_link_id?: string;
    duplicate_of_code?: string;
    alternate_of_code?: string;
    reprint_of?: string;
    alt_art_investigator?: boolean;
    taboo_set_id?: number;
    taboo_xp?: number;
    errata_date?: string;
    tags?: string[];
    restrictions?: unknown;
    deck_requirements?: unknown;
    deck_options?: unknown;
    side_deck_requirements?: unknown;
    side_deck_options?: unknown;
    customization_options?: unknown;
    attachments?: unknown;
    abbreviation?: string;
    back_type?: string;
    starts_in_play?: boolean;
    starts_in_hand?: boolean;
    sticky_mulligan?: boolean;
  };

  export type Investigator = Card & {
    type_code: "investigator";
  };
}
