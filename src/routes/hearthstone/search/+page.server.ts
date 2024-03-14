import { searchCards } from "$lib/hearthstone/card";
import { error } from "@sveltejs/kit";

export const config = { runtime: "nodejs18.x" };

export async function load({ url }) {
  const query = url.searchParams.get("query");
  const classFilter = url.searchParams.get("class");
  const setFilter = url.searchParams.get("set");
  const pageNumber = Number(url.searchParams.get("page"));

  try {
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
  } catch (err) {
    console.error(err);
    error(500, "Internal Server Error");
  }
}
