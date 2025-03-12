import { getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import { error } from "@sveltejs/kit";

export async function load() {
  try {
    const metadata = await getHearthstoneMetadata();

    return { metadata };
  } catch (err) {
    console.error(err);
    error(500, "Error fetching metadata.");
  }
}
