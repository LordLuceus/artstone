import { searchCards } from "$lib/hearthstone/card";
import { getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import { error } from "@sveltejs/kit";

export async function load({ url }) {
  let metadata;
  try {
    metadata = await getHearthstoneMetadata();
  } catch (err) {
    console.error(err);
    error(500, "Error fetching metadata.");
  }

  const query = url.searchParams.get("query");
  const classFilter = url.searchParams.get("class");
  const setFilter = url.searchParams.get("set");

  const hasSearch = query || classFilter || setFilter;
  if (!hasSearch) {
    return { metadata, cards: [], page: 0, pageCount: 0, cardCount: 0 };
  }

  const pageNumber = Number(url.searchParams.get("page")) || 1;

  const { cards, page, pageCount, cardCount } = await searchCards(
    query,
    classFilter,
    setFilter,
    pageNumber
  );

  return {
    metadata,
    cards,
    page,
    pageCount,
    cardCount
  };
}
