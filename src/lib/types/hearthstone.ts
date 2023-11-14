import type { Set, Class, Rarity, Generic, Keyword } from "./hearthstone-metadata";

export interface HearthstoneCardSearchResponse {
  cardCount: number;
  page: number;
  pageCount: number;
  cards: HearthstoneCard[];
}

export interface HearthstoneCard {
  id: number;
  collectible: 0 | 1;
  slug: string;
  classId: number;
  multiClassIds: number[];
  cardTypeId: number;
  cardSetId?: number;
  rarityId?: number;
  artistName?: string;
  attack?: number;
  health?: number; // minion health, also used for location durability, but not weapon durability, because that would make too much sense. Small indie company.
  durability?: number; // weapon durability, see above
  armor?: number; // hero card armor
  manaCost?: number;
  name: string;
  text?: string;
  image?: string;
  imageGold?: string;
  flavorText?: string;
  cropImage?: string;
  childIds?: number[];
  keywordIds?: number[];
  minionTypeId?: number;
  multiTypeIds?: number[];
  spellSchoolId?: number;
  runeCost?: RuneCost;
}

export interface RuneCost {
  blood: number;
  frost: number;
  unholy: number;
}

export interface HearthstoneCardWithMetadata extends HearthstoneCard {
  cardSet?: Set;
  cardType?: Generic;
  classes?: Class[];
  minionTypes?: Generic[];
  spellSchool?: Generic;
  rarity?: Rarity;
  keywords?: Keyword[];
  artDescription?: string;
  descriptionUpvotes?: number;
  descriptionDownvotes?: number;
}
