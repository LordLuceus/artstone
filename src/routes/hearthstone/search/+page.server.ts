import { hearthstoneClient } from "$lib/hearthstone/client";
import { addMetadata, getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import type {
  HearthstoneCardSearchResponse,
  HearthstoneCardWithMetadata
} from "$lib/types/hearthstone";
import type { HearthstoneMetadata } from "$lib/types/hearthstone-metadata";
import { error } from "@sveltejs/kit";

export const config = { runtime: "nodejs18.x" };

export async function load({ url }) {
  const query = url.searchParams.get("query");
  const c = url.searchParams.get("class");
  console.log(c);

  try {
    const metadata = await getHearthstoneMetadata();
    const { data } = await hearthstoneClient.cardSearch<HearthstoneCardSearchResponse>({
      textFilter: query?.toString(),
      gameMode: "constructed",
      collectible: 1,
      pageSize: 10
    });

    const cards: HearthstoneCardWithMetadata[] = filterCards(data, metadata);

    return {
      cards
    };
  } catch (err) {
    console.error(err);
    throw error(500, "Internal Server Error");
  }
}

function filterCards(data: HearthstoneCardSearchResponse, metadata: HearthstoneMetadata) {
  const cards = data.cards.filter((card) => card.image);

  const cardsWithMetadata = addMetadata(cards, metadata) as HearthstoneCardWithMetadata[];

  // Filter out cards without a recognised set
  const result = cardsWithMetadata.filter((card) => card.cardSet);
  return result;
}
