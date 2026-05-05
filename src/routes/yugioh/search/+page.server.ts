import { getYGOArchetypes, getYGOAttributes, getYGOTypes, searchYGOCards } from "$lib/yugioh/card";

export async function load({ url }) {
  const query = url.searchParams.get("query");
  const type = url.searchParams.get("type") || "";
  const attribute = url.searchParams.get("attribute") || "";
  const archetype = url.searchParams.get("archetype") || "";

  const [types, attributes, archetypes] = await Promise.all([
    getYGOTypes(),
    getYGOAttributes(),
    getYGOArchetypes()
  ]);

  const hasSearch = query || type || attribute || archetype;
  if (!hasSearch) {
    return { types, attributes, archetypes, cards: [], page: 0, pageCount: 0, cardCount: 0 };
  }

  const pageNumber = Number(url.searchParams.get("page")) || 1;

  const { cards, page, pageCount, cardCount } = await searchYGOCards(
    query,
    type,
    attribute,
    archetype,
    pageNumber
  );

  return {
    types,
    attributes,
    archetypes,
    cards,
    page,
    pageCount,
    cardCount
  };
}
