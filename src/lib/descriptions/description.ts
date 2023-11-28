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

export async function upvoteDescription(game: SupportedGames, slug: string) {
  const key = `${game}-card:${slug}:description`;

  const exists = await client.exists(key);

  if (exists) await client.hincrby(key, "upvotes", 1);
}

export async function downvoteDescription(game: SupportedGames, slug: string) {
  const key = `${game}-card:${slug}:description`;

  const exists = await client.exists(key);

  if (exists) await client.hincrby(key, "downvotes", 1);
}

export async function removeUpvote(game: SupportedGames, slug: string) {
  const key = `${game}-card:${slug}:description`;

  const exists = await client.exists(key);

  if (exists) await client.hincrby(key, "upvotes", -1);
}

export async function removeDownvote(game: SupportedGames, slug: string) {
  const key = `${game}-card:${slug}:description`;

  const exists = await client.exists(key);

  if (exists) await client.hincrby(key, "downvotes", -1);
}
