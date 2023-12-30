import { getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import { error } from "@sveltejs/kit";

export const prerender = true;

export async function load() {
  try {
    const metadata = await getHearthstoneMetadata();

    return { metadata };
  } catch (err) {
    console.error("Error fetching metadata", err);
    throw error(500, "Error fetching metadata.");
  }
}
