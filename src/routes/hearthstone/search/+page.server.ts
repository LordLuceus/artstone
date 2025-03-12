import { searchCards } from "$lib/hearthstone/card";

export async function load({ url }) {
  const query = url.searchParams.get("query");
  const classFilter = url.searchParams.get("class");
  const setFilter = url.searchParams.get("set");
  const pageNumber = Number(url.searchParams.get("page"));

  const { cards, page, pageCount, cardCount } = await searchCards(
    query,
    classFilter,
    setFilter,
    pageNumber
  );

  return {
    cards,
    page,
    pageCount,
    cardCount
  };
}
