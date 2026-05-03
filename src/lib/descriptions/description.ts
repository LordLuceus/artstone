import { redis } from "$lib/redis";
import type { SupportedGames } from "$lib/types/games";

function cacheKey(game: SupportedGames, id: number | string, face?: number) {
  if (face !== undefined) {
    return `${game}-card:${id}:face-${face}:description`;
  }
  return `${game}-card:${id}:description`;
}

export async function getDescription(game: SupportedGames, id: number | string, face?: number) {
  const description = await redis.get(cacheKey(game, id, face));

  if (!description) {
    return null;
  }

  return description;
}

export async function setDescription(
  game: SupportedGames,
  id: number | string,
  description: string,
  face?: number
) {
  await redis.set(cacheKey(game, id, face), description);
}
