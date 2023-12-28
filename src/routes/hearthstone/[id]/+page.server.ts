import { getCard } from "$lib/hearthstone/card";
import { error } from "@sveltejs/kit";

export const config = { runtime: "nodejs18.x" };

export async function load({ params }) {
  const { id } = params;

  try {
    const card = await getCard(Number(id));

    return { card };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response.status === 404) {
      throw error(404, "Card not found.");
    }

    console.error(err);
    throw error(500, "Internal Server Error");
  }
}
