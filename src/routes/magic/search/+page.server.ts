import { getMagicSets, searchMagicCards } from "$lib/magic/card";

export async function load({ url }) {
  const query = url.searchParams.get("query");
  const colours = url.searchParams.getAll("colour");
  const set = url.searchParams.get("set") || "";
  const format = url.searchParams.get("format") || "";

  const sets = await getMagicSets();

  const hasSearch = query || colours.length > 0 || set || format;
  if (!hasSearch) {
    return { sets, cards: [], page: 0, pageCount: 0, cardCount: 0 };
  }

  const pageNumber = Number(url.searchParams.get("page")) || 1;

  const { cards, page, pageCount, cardCount } = await searchMagicCards(
    query,
    colours,
    set,
    format,
    pageNumber
  );

  return {
    sets,
    cards,
    page,
    pageCount,
    cardCount
  };
}
