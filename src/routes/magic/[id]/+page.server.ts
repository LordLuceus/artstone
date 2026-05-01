import { getMagicCard } from "$lib/magic/card";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const { id } = params;

  try {
    const card = await getMagicCard(id);
    return { card };
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((err as any).message === "Card not found") {
      error(404, "Card not found.");
    }

    console.error(err);
    error(500, "Internal Server Error");
  }
}
