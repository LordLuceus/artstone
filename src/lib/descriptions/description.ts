import { client } from "$lib/kv/client";
import type { CardDescription } from "$lib/types/card-description";
import type { SupportedGames } from "$lib/types/games";

function deserialize(hash: { [key: string]: unknown }): CardDescription {
  return {
    description: String(hash.description),
    upvotes: hash.upvotes ? parseInt(String(hash.upvotes), 10) : undefined,
    downvotes: hash.downvotes ? parseInt(String(hash.downvotes), 10) : undefined
  };
}

function serialize(description: CardDescription): { [key: string]: unknown } {
  return {
    description: description.description,
    upvotes: description.upvotes?.toString() ?? "0",
    downvotes: description.downvotes?.toString() ?? "0"
  };
}

export async function getDescription(game: SupportedGames, slug: string) {
  const description = await client.hgetall(`${game}-card:${slug}:description`);

  if (!description) {
    return null;
  }

  const result = deserialize(description);
  return result;
}

export async function setDescription(
  game: SupportedGames,
  slug: string,
  description: CardDescription
) {
  await client.hset(`${game}-card:${slug}:description`, serialize(description));
}
