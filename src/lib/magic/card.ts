import type { ScryfallCard, ScryfallSearchResponse } from "$lib/magic/types";
import type { DisplayCard } from "$lib/types/display-card";

const SCRYFALL_BASE = "https://api.scryfall.com";

export interface MagicSet {
  code: string;
  name: string;
  released_at: string | null;
}

export async function getMagicSets(): Promise<MagicSet[]> {
  const response = await fetch(`${SCRYFALL_BASE}/sets`, {
    headers: { "User-Agent": "Artstone/1.0", Accept: "application/json" }
  });

  if (!response.ok) {
    throw new Error(`Scryfall sets failed: ${response.status}`);
  }

  const data = await response.json();
  return data.data
    .map((set: { code: string; name: string; released_at: string | null }) => ({
      code: set.code,
      name: set.name,
      released_at: set.released_at
    }))
    .sort((a: MagicSet, b: MagicSet) => {
      if (!a.released_at) return 1;
      if (!b.released_at) return -1;
      return b.released_at.localeCompare(a.released_at);
    });
}

export const magicFormats = [
  { label: "All Formats", value: "" },
  { label: "Standard", value: "standard" },
  { label: "Pioneer", value: "pioneer" },
  { label: "Modern", value: "modern" },
  { label: "Legacy", value: "legacy" },
  { label: "Vintage", value: "vintage" },
  { label: "Commander", value: "commander" },
  { label: "Pauper", value: "pauper" },
  { label: "Brawl", value: "brawl" },
  { label: "Historic", value: "historic" },
  { label: "Explorer", value: "explorer" },
  { label: "Timeless", value: "timeless" },
  { label: "Oathbreaker", value: "oathbreaker" }
];

export const magicColours = [
  { label: "White", value: "W" },
  { label: "Blue", value: "U" },
  { label: "Black", value: "B" },
  { label: "Red", value: "R" },
  { label: "Green", value: "G" },
  { label: "Colourless", value: "C" }
];

export async function searchMagicCards(
  query: string | null,
  colours: string[] = [],
  set: string = "",
  format: string = "",
  pageNumber = 1
): Promise<{ cards: DisplayCard[]; page: number; pageCount: number; cardCount: number }> {
  const parts: string[] = [];

  if (query?.trim()) {
    parts.push(query.trim());
  }

  if (colours.length > 0) {
    parts.push(`c:${colours.join("")}`);
  }

  if (set) {
    parts.push(`e:${set}`);
  }

  if (format) {
    parts.push(`f:${format}`);
  }

  const searchQuery = parts.length > 0 ? parts.join(" ") : "*";
  const page = pageNumber || 1;
  const pageSize = 175;

  const url = new URL(`${SCRYFALL_BASE}/cards/search`);
  url.searchParams.set("q", searchQuery);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("unique", "cards");

  const response = await fetch(url.toString(), {
    headers: { "User-Agent": "Artstone/1.0", Accept: "application/json" }
  });

  if (!response.ok) {
    if (response.status === 404 || response.status === 422) {
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
