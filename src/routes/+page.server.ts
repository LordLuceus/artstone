import type { RequestEvent } from "@sveltejs/kit";
import type { Card } from "../types/card.js";

export const actions = {
  search: async ({ request }: RequestEvent) => {
    const data = await request.formData();
    const query = data.get("query");

    const url = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/search/${query}?collectible=1`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "15f6918506msh2fda810a1beea9ep1b0070jsna4433ded3338",
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
