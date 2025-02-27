import { redis } from "$lib/redis";
import type { SupportedGames } from "$lib/types/games";

export async function getDescription(game: SupportedGames, id: number) {
  const description = await redis.get(`${game}-card:${id}:description`);

  if (!description) {
    return null;
  }

  return description;
}

export async function setDescription(game: SupportedGames, id: number, description: string) {
  await redis.set(`${game}-card:${id}:description`, description);
}
