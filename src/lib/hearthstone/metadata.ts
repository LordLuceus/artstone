import { client } from "$lib/kv/client";
import type { HearthstoneCard, HearthstoneCardWithMetadata } from "../types/hearthstone";
import type { HearthstoneMetadata } from "../types/hearthstone-metadata";
import { hearthstoneClient } from "./client";

export async function getHearthstoneMetadata() {
  let metadata = await client.get<HearthstoneMetadata>("hearthstone-metadata");

  if (!metadata) {
    metadata = await fetchHearthstoneMetadata();
    await client.set("hearthstone-metadata", metadata, { ex: 86400 });
  }

  return metadata;
}

async function fetchHearthstoneMetadata() {
  const { data } = await hearthstoneClient.metadata<HearthstoneMetadata>();
  return data;
}

export function addMetadata(
  cards: HearthstoneCard[] | HearthstoneCard,
  metadata: HearthstoneMetadata
) {
  if (!Array.isArray(cards)) {
    const cardWithMetadata = addCardMetadata(cards, metadata);
    return cardWithMetadata;
  }

  const cardsWithMetadata = cards.map((card) => addCardMetadata(card, metadata));

  return cardsWithMetadata;
}

function addCardMetadata(card: HearthstoneCard, metadata: HearthstoneMetadata) {
  const cardWithMetadata = { ...card } as HearthstoneCardWithMetadata;
  cardWithMetadata.cardSet = metadata.sets.find((set) => set.id === card.cardSetId);
  cardWithMetadata.cardType = metadata.types.find((type) => type.id === card.cardTypeId);
  cardWithMetadata.classes = metadata.classes.filter((c) => card.multiClassIds?.includes(c.id));
  if (cardWithMetadata.classes.length === 0) {
    cardWithMetadata.classes = metadata.classes.filter((c) => c.id === card.classId);
  }

  cardWithMetadata.minionTypes = metadata.minionTypes.filter(
    (minionType) => card.minionTypeId === minionType.id
  );
  if (card.multiTypeIds && card.multiTypeIds.length > 0) {
    cardWithMetadata.minionTypes = [
      ...cardWithMetadata.minionTypes,
      ...metadata.minionTypes.filter((minionType) => card.multiTypeIds?.includes(minionType.id))
    ];
  }

  cardWithMetadata.spellSchool = metadata.spellSchools.find(
    (spellSchool) => spellSchool.id === card.spellSchoolId
  );
  cardWithMetadata.rarity = metadata.rarities.find((rarity) => rarity.id === card.rarityId);
  cardWithMetadata.keywords = metadata.keywords.filter((keyword) =>
    card.keywordIds?.includes(keyword.id)
  );

  return cardWithMetadata;
}
