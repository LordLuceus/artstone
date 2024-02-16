import { getRelatedCards } from "$lib/hearthstone/card";
import { getHearthstoneMetadata } from "$lib/hearthstone/metadata";
import { json, type RequestHandler } from "@sveltejs/kit";

export const config = { runtime: "nodejs18.x" };

export const GET = (async ({ url }) => {
  const ids = url.searchParams.get("ids");
  const start = Number(url.searchParams.get("start"));
  const limit = Number(url.searchParams.get("limit") || 20);

  if (!ids) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    const metadata = await getHearthstoneMetadata();
    const cards = await getRelatedCards(
      ids
        .split(",")
        .slice(start, start + limit)
        .map(Number),
      metadata
    );

    return json({ cards });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}) satisfies RequestHandler;
