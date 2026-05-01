import { getRandomMagicCard } from "$lib/magic/card";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async () => {
  try {
    const card = await getRandomMagicCard();
    return json({ id: card.id });
  } catch (err) {
    console.error(err);
    error(500, "Failed to fetch random card");
  }
}) satisfies RequestHandler;
