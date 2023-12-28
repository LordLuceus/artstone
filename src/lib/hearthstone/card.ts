import { client } from "$lib/kv/client";
import { getHearthstoneMetadata, addMetadata } from "./metadata";
import type { HearthstoneCard, HearthstoneCardWithMetadata } from "$lib/types/hearthstone";
import { hearthstoneClient } from "./client";

const fetchedIds = new Set<number>();

export async function getCard(id: number) {
  if (fetchedIds.has(id)) {
    throw new Error(`Oi! Circular dependency detected for card id: ${id}`);
  }
  fetchedIds.add(id);

  const metadata = await getHearthstoneMetadata();
  let card = await client.get<HearthstoneCard>(`hearthstone-card:${id}`);

  if (!card) {
    try {
      card = await fetchCard(id);
      await client.set(`hearthstone-card:${card.id}`, card, { ex: 86400 });
    } catch (error) {
      console.error(`Error fetching card data for slug: ${id}`, error);
      throw error;
    }
  }

  card = addMetadata(card, metadata) as HearthstoneCardWithMetadata;

  if (card.childIds && card.childIds.length > 0) {
    const filteredIds = card.childIds.filter((childId) => !fetchedIds.has(childId));
    const children = await Promise.all(filteredIds.map((childId) => getCard(childId)));
    (card as HearthstoneCardWithMetadata).relatedCards = children;
  }

  fetchedIds.delete(id);

  return card as HearthstoneCardWithMetadata;
}

async function fetchCard(id: number) {
  const { data } = await hearthstoneClient.card<HearthstoneCardWithMetadata>({ id });
  return data;
}
