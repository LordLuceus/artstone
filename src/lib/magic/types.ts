export interface ScryfallSearchResponse {
  object: "list";
  total_cards: number;
  has_more: boolean;
  data: ScryfallCard[];
}

export interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  flavor_text?: string;
  set_name?: string;
  collector_number?: string;
  rarity?: string;
  artist?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  related_uris?: Record<string, string>;
  prints_search_uri?: string;
}
