import { getCardImageUrl, getYGOCard } from "$lib/yugioh/card";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const id = Number(params.id);

  if (isNaN(id)) {
    error(404, "Invalid card ID");
  }

  const card = await getYGOCard(id);

  if (!card) {
    error(404, "Card not found");
  }

  return { card, imageUrl: getCardImageUrl(card) };
}
