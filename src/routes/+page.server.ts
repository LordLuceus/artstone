import { getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import { error } from "@sveltejs/kit";

export const config = { runtime: "nodejs18.x" };

export async function load() {
  try {
    const metadata = await getHearthstoneMetadata();

    return { metadata };
  } catch (err) {
    console.error("Error fetching metadata", err);
    error(500, "Error fetching metadata.");
  }
}
