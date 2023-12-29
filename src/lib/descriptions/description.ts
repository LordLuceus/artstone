import { client } from "$lib/kv/client";
import type { SupportedGames } from "$lib/types/games";

export async function getDescription(game: SupportedGames, id: number) {
  const description = await client.get<string>(`${game}-card:${id}:description`);

  if (!description) {
    return null;
  }

  return description;
}

export async function setDescription(game: SupportedGames, id: number, description: string) {
  await client.set(`${game}-card:${id}:description`, description);
}
