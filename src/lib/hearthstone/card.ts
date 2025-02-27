import { redis } from "$lib/redis";
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
  const cached = await redis.get(`hearthstone-card:${id}`);
  let card: HearthstoneCard;

  if (!cached) {
    try {
      card = await fetchCard(id);
      await redis.set(`hearthstone-card:${card.id}`, JSON.stringify(card), "EX", 86400);
    } catch (error) {
      console.error(`Error fetching card data for id: ${id}`, error);
      throw error;
    }
  } else {
    card = JSON.parse(cached);
  }

  card = addMetadata(card, metadata) as HearthstoneCardWithMetadata;

  return card as HearthstoneCardWithMetadata;
}

async function fetchCard(id: number) {
  const { data } = await hearthstoneClient.card<HearthstoneCard>({ id });
  return data;
}

export async function getRelatedCards(ids: number[], metadata: HearthstoneMetadata) {
  const cards = await Promise.all(ids.map((id) => getRelatedCard(id, metadata)));
  return cards;
}

async function getRelatedCard(id: number, metadata: HearthstoneMetadata) {
  const cached = await redis.get(`hearthstone-card:${id}`);

  if (cached) {
    return addMetadata(JSON.parse(cached), metadata) as HearthstoneCardWithMetadata;
  }

  const card = await fetchCard(id);

  return addMetadata(card, metadata) as HearthstoneCardWithMetadata;
}

export async function searchCards(
  query: string | null,
  classFilter: string | null,
  setFilter: string | null,
  pageNumber = 1
): Promise<HearthstoneCardSearchResponse> {
  const metadata = await getHearthstoneMetadata();
  const { data } = await hearthstoneClient.cardSearch<HearthstoneCardSearchResponse>({
    textFilter: query ?? undefined,
    gameMode: "constructed",
    collectible: 1,
    page: pageNumber,
    pageSize: 20,
    class: classFilter as CardClass | undefined,
    set: setFilter ?? undefined
  });

  const cards = filterCards(data, metadata);

  return { cards, page: data.page, pageCount: data.pageCount, cardCount: data.cardCount };
}

function filterCards(data: HearthstoneCardSearchResponse, metadata: HearthstoneMetadata) {
  const cards = data.cards.filter((card) => card.image);

  const cardsWithMetadata = addMetadata(cards, metadata) as HearthstoneCardWithMetadata[];

  // Filter out cards without a recognised set
  const result = cardsWithMetadata.filter((card) => card.cardSet);
  return result;
}
