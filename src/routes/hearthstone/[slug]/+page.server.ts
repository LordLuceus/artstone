import type { HearthstoneCardWithMetadata } from "$lib/types/hearthstone";
import { hearthstoneClient } from "$lib/hearthstone/hearthstone-api";
import { addMetadata, getHearthstoneMetadata } from "$lib/hearthstone/hearthstone-metadata";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const { slug } = params;

  try {
    const metadata = await getHearthstoneMetadata();
    const { data } = await hearthstoneClient.card<HearthstoneCardWithMetadata>({ id: slug });

    addMetadata(data, metadata);

    return { card: data };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.response.status === 404) {
      throw error(404, "Card not found.");
    }

    console.error(err);
    throw error(500, "Internal Server Error");
  }
}
