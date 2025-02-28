import { env } from "$env/dynamic/private";
import { hs } from "blizzard.js";
import type { HSClient } from "blizzard.js/dist/hs";

async function getHSClient() {
  if (!env.BATTLENET_CLIENT_ID || !env.BATTLENET_CLIENT_SECRET) {
    return null;
  }
  return await hs.createInstance({
    key: env.BATTLENET_CLIENT_ID,
    secret: env.BATTLENET_CLIENT_SECRET,
    origin: "us",
    locale: "en_US"
  });
}

export const hearthstoneClient = (await getHSClient()) as HSClient;
