import { searchMagicCards } from "$lib/magic/card";

export async function load({ url }) {
  const query = url.searchParams.get("query");

  if (!query) {
    return { cards: [], page: 0, pageCount: 0, cardCount: 0 };
  }

  const pageNumber = Number(url.searchParams.get("page")) || 1;

  const { cards, page, pageCount, cardCount } = await searchMagicCards(query, pageNumber);

  return {
    cards,
    page,
    pageCount,
    cardCount
  };
}
