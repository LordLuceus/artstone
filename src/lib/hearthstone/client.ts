import { env } from "$env/dynamic/private";
import { hs } from "blizzard.js";

export const hearthstoneClient = await hs.createInstance({
  key: env.BATTLENET_CLIENT_ID,
  secret: env.BATTLENET_CLIENT_SECRET,
  origin: "us",
  locale: "en_US"
});
