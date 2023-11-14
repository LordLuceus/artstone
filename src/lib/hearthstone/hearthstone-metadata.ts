import { createClient } from "@vercel/kv";
import { hearthstoneClient } from "./hearthstone-api";
import type { HearthstoneMetadata } from "../types/hearthstone-metadata";
import { KV_REST_API_TOKEN, KV_REST_API_URL } from "$env/static/private";
import type { HearthstoneCard, HearthstoneCardWithMetadata } from "../types/hearthstone";

const kv = createClient({ url: KV_REST_API_URL, token: KV_REST_API_TOKEN });

export async function getHearthstoneMetadata() {
  let metadata = await kv.get<HearthstoneMetadata>("hearthstone-metadata");

  if (!metadata) {
    metadata = await fetchHearthstoneMetadata();
    await kv.setex("hearthstone-metadata", 86400, metadata);
  }

  return metadata;
}

export async function fetchHearthstoneMetadata() {
  const { data } = await hearthstoneClient.metadata<HearthstoneMetadata>();
  return data;
}

export function addMetadata(
  cards: HearthstoneCardWithMetadata[] | HearthstoneCardWithMetadata,
  metadata: HearthstoneMetadata
) {
  if (!Array.isArray(cards)) {
    addCardMetadata(cards, metadata);
    return;
  }

  cards.forEach((card) => {
    addCardMetadata(card, metadata);
  });
}

function addCardMetadata(card: HearthstoneCardWithMetadata, metadata: HearthstoneMetadata) {
  card.cardSet = metadata.sets.find((set) => set.id === card.cardSetId);
  card.cardType = metadata.types.find((type) => type.id === card.cardTypeId);
  card.classes = metadata.classes.filter((c) => card.multiClassIds?.includes(c.id));
  if (card.classes.length === 0) {
    card.classes = metadata.classes.filter((c) => c.id === card.classId);
  }

  card.minionTypes = metadata.minionTypes.filter(
    (minionType) => card.minionTypeId === minionType.id
  );
  if (card.multiTypeIds && card.multiTypeIds.length > 0) {
    card.minionTypes = [
      ...card.minionTypes,
      ...metadata.minionTypes.filter((minionType) => card.multiTypeIds?.includes(minionType.id))
    ];
  }

  card.spellSchool = metadata.spellSchools.find(
    (spellSchool) => spellSchool.id === card.spellSchoolId
  );
  card.rarity = metadata.rarities.find((rarity) => rarity.id === card.rarityId);
  card.keywords = metadata.keywords.filter((keyword) => card.keywordIds?.includes(keyword.id));
}
