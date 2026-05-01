import type { ScryfallCard, ScryfallSearchResponse } from "$lib/magic/types";
import type { DisplayCard } from "$lib/types/display-card";

const SCRYFALL_BASE = "https://api.scryfall.com";

export async function searchMagicCards(
  query: string | null,
  pageNumber = 1
): Promise<{ cards: DisplayCard[]; page: number; pageCount: number; cardCount: number }> {
  const searchQuery = query?.trim() || "*";
  const page = pageNumber || 1;
  const pageSize = 20;

  const url = new URL(`${SCRYFALL_BASE}/cards/search`);
  url.searchParams.set("q", searchQuery);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("unique", "cards");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "Artstone/1.0", Accept: "application/json" }
  });

  if (!response.ok) {
    if (response.status === 404) {
      return { cards: [], page: 1, pageCount: 0, cardCount: 0 };
    }
    throw new Error(`Scryfall search failed: ${response.status}`);
  }

  const data: ScryfallSearchResponse = await response.json();

  const cards = data.data.filter((card) => card.image_uris?.normal).map(toDisplayCard);

  const cardCount = data.total_cards;
  const pageCount = Math.ceil(cardCount / pageSize);

  return { cards, page, pageCount, cardCount };
}

export async function getMagicCard(id: string): Promise<ScryfallCard> {
  const response = await fetch(`${SCRYFALL_BASE}/cards/${id}`, {
    headers: { "User-Agent": "Artstone/1.0", Accept: "application/json" }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Card not found");
    }
    throw new Error(`Scryfall card fetch failed: ${response.status}`);
  }

  const card: ScryfallCard = await response.json();
  return card;
}

export async function getRandomMagicCard(): Promise<ScryfallCard> {
  const response = await fetch(`${SCRYFALL_BASE}/cards/random`, {
    headers: { "User-Agent": "Artstone/1.0", Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Scryfall random card failed: ${response.status}`);
  }

  const card: ScryfallCard = await response.json();
  return card;
}

function toDisplayCard(card: ScryfallCard): DisplayCard {
  return {
    id: card.id,
    name: card.name,
    image: card.image_uris?.normal,
    text: card.oracle_text,
    setName: card.set_name
  };
}
