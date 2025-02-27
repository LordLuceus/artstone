import { getRelatedCards } from "$lib/hearthstone/card";
import { getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const GET = (async ({ url }) => {
  const ids = url.searchParams.get("ids");
  const start = Number(url.searchParams.get("start"));
  const limit = Number(url.searchParams.get("limit") || 20);

  if (!ids) {
    return error(400, "ids is required");
  }

  const metadata = await getHearthstoneMetadata();
  const cards = await getRelatedCards(
    ids
      .split(",")
      .slice(start, start + limit)
      .map(Number),
    metadata
  );

  return json({ cards });
}) satisfies RequestHandler;
