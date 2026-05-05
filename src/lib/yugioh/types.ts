export interface YGOCard {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  scale?: number;
  linkval?: number;
  linkmarkers?: string[];
  card_images: YGOCardImage[];
  card_sets?: YGOCardSet[];
}

export interface YGOCardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface YGOCardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

export interface YGOSearchResponse {
  data: YGOCard[];
  meta?: {
    current_rows: number;
    total_rows: number;
    rows_remaining: number;
    total_pages: number;
    pages_remaining: number;
    next_page?: string;
    next_page_offset?: number;
  };
}

export interface YGOArchetype {
  archetype_name: string;
}

export interface YGOCardSetInfo {
  set_name: string;
  set_code: string;
}
