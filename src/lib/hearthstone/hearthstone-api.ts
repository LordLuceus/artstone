import { BATTLENET_CLIENT_ID, BATTLENET_CLIENT_SECRET } from "$env/static/private";
import { hs } from "blizzard.js";

export const hearthstoneClient = await hs.createInstance({
  key: BATTLENET_CLIENT_ID,
  secret: BATTLENET_CLIENT_SECRET,
  origin: "us",
  locale: "en_US"
});
