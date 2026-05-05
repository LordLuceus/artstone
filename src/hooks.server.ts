import { syncAllCards, syncUpdates } from "$lib/yugioh/card";
import type { Handle } from "@sveltejs/kit";

let syncStarted = false;

function startBackgroundSync() {
  if (syncStarted) return;
  syncStarted = true;

  syncAllCards().catch((err) => {
    console.error("[YuGiOh] Initial sync failed:", err);
  });

  setInterval(
    () => {
      syncUpdates().catch((err) => {
        console.error("[YuGiOh] Update sync failed:", err);
      });
    },
    24 * 60 * 60 * 1000
  );
}

startBackgroundSync();

export const handle = (async ({ event, resolve }) => {
  return resolve(event);
}) satisfies Handle;
