import { searchCards } from "$lib/hearthstone/card";
import { error } from "@sveltejs/kit";

export const config = { runtime: "nodejs18.x" };

export async function load({ url }) {
  const query = url.searchParams.get("query");
  const classFilter = url.searchParams.get("class");
  const setFilter = url.searchParams.get("set");

  try {
    const { cards } = await searchCards(query, classFilter, setFilter);

    return {
      cards
    };
  } catch (err) {
    console.error(err);
    throw error(500, "Internal Server Error");
  }
}
