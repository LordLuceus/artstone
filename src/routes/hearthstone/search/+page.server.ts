import { searchCards } from "$lib/hearthstone/card";
import { error } from "@sveltejs/kit";
import type { CardClass } from "blizzard.js/dist/resources/hs.js";

export const config = { runtime: "nodejs18.x" };

export async function load({ url }) {
  const { query, classFilter, setFilter } = parseFilterParams(url.searchParams);

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
