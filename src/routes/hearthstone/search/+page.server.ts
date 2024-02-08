import { hearthstoneClient } from "$lib/hearthstone/client";
import { addMetadata, getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import type {
  HearthstoneCardSearchResponse,
  HearthstoneCardWithMetadata
} from "$lib/types/hearthstone";
import type { HearthstoneMetadata } from "$lib/types/hearthstone-metadata";
import { error } from "@sveltejs/kit";
import type { CardClass } from "blizzard.js/dist/resources/hs.js";

export const config = { runtime: "nodejs18.x" };

export async function load({ url }) {
  const { query, classFilter, setFilter } = parseFilterParams(url.searchParams);

  try {
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

function parseFilterParams(params: URLSearchParams) {
  const query = params.get("query");
  const cardClass = params.get("class");
  const set = params.get("set");
  let classFilter: CardClass[] = [];
  let setFilter: string[] = [];

  if (cardClass) {
    classFilter = cardClass.split(",") as CardClass[];
  }

  if (set) {
    setFilter = set.split(",");
  }
  return { query, classFilter, setFilter };
}
