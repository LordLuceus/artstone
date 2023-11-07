import type { RequestEvent } from "@sveltejs/kit";
import type { Card } from "../types/card.js";
import { RAPID_API_KEY } from "$env/static/private";

export const actions = {
  search: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const query = data.get("query");

    const url = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/${query}?collectible=1`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "omgvamp-hearthstone-v1.p.rapidapi.com"
      }
    };

    try {
      const response = await fetch(url, options);
      const result: Card[] = await response.json();
      return { cards: result };
    } catch (error) {
      console.error(error);
    }
  }
};
