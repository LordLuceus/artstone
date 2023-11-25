import { client } from "$lib/kv/client";
import { getHearthstoneMetadata, addMetadata } from "./metadata";
import type { HearthstoneCard, HearthstoneCardWithMetadata } from "$lib/types/hearthstone";
import { hearthstoneClient } from "./client";

export async function getCard(slug: string) {
  const metadata = await getHearthstoneMetadata();
  let card = await client.get<HearthstoneCard>(`hearthstone-card:${slug}`);

  if (!card) {
    card = await fetchCard(slug);
    await client.set(`hearthstone-card:${slug}`, card, { ex: 86400 });

    console.log("Fetched and cached card data");
  }

  card = addMetadata(card, metadata) as HearthstoneCardWithMetadata;
  return card;
}

async function fetchCard(slug: string) {
  const { data } = await hearthstoneClient.card<HearthstoneCardWithMetadata>({ id: slug });
  return data;
}
