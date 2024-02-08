import { client } from "$lib/kv/client";
import type {
  HearthstoneCard,
  HearthstoneCardSearchResponse,
  HearthstoneCardWithMetadata
} from "$lib/types/hearthstone";
import type { HearthstoneMetadata } from "$lib/types/hearthstone-metadata";
import type { CardClass } from "blizzard.js/dist/resources/hs";
import { hearthstoneClient } from "./client";
import { addMetadata, getHearthstoneMetadata } from "./metadata";

export async function getCard(id: number) {
  const metadata = await getHearthstoneMetadata();
  let card = await client.get<HearthstoneCard>(`hearthstone-card:${id}`);

  if (!card) {
    try {
      card = await fetchCard(id);
      await client.set(`hearthstone-card:${card.id}`, card, { ex: 86400 });
    } catch (error) {
      console.error(`Error fetching card data for id: ${id}`, error);
      throw error;
    }
  }

  card = addMetadata(card, metadata) as HearthstoneCardWithMetadata;

  if (card.childIds && card.childIds.length > 0) {
    (card as HearthstoneCardWithMetadata).relatedCards = await getRelatedCards(
      card.childIds,
      metadata
    );
  }

  return card as HearthstoneCardWithMetadata;
}

async function fetchCard(id: number) {
  const { data } = await hearthstoneClient.card<HearthstoneCard>({ id });
  return data;
}

async function getRelatedCards(ids: number[], metadata: HearthstoneMetadata) {
  const cards = await Promise.all(ids.map((id) => getRelatedCard(id, metadata)));
  return cards;
}

async function getRelatedCard(id: number, metadata: HearthstoneMetadata) {
  const cached = await client.get<HearthstoneCard>(`hearthstone-card:${id}`);

  if (cached) {
    return addMetadata(cached, metadata) as HearthstoneCardWithMetadata;
  }

  const card = await fetchCard(id);

  return addMetadata(card, metadata) as HearthstoneCardWithMetadata;
}

export async function searchCards(
  query: string | null,
  classFilter: CardClass[],
  setFilter: string[]
): Promise<HearthstoneCardSearchResponse> {
  const metadata = await getHearthstoneMetadata();
  const { data } = await hearthstoneClient.cardSearch<HearthstoneCardSearchResponse>({
    textFilter: query ?? undefined,
    gameMode: "constructed",
    collectible: 1,
    pageSize: 1000,
    class: classFilter[0],
    set: setFilter[0]
  });

  const cards = filterCards(data, metadata);

  return { cards, page: 1, pageCount: 1, cardCount: cards.length };
}

function filterCards(data: HearthstoneCardSearchResponse, metadata: HearthstoneMetadata) {
  const cards = data.cards.filter((card) => card.image);

  const cardsWithMetadata = addMetadata(cards, metadata) as HearthstoneCardWithMetadata[];

  // Filter out cards without a recognised set
  const result = cardsWithMetadata.filter((card) => card.cardSet);
  return result;
}
