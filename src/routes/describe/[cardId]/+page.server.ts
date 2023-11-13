import { RAPID_API_KEY } from "$env/static/private";
import type { Card } from "../../../lib/types/card";

export async function load({ params }) {
  const url = `https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/${params.cardId}?collectible=1`;
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
    return { card: result[0] };
  } catch (error) {
    console.error(error);
  }
}
