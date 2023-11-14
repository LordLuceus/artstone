import type { RuneCost } from "$lib/types/hearthstone";

export function formatRunes(runes: RuneCost): string {
  const parts = [];

  if (runes.blood > 0) {
    parts.push(`${runes.blood} Blood`);
  }

  if (runes.frost > 0) {
    parts.push(`${runes.frost} Frost`);
  }

  if (runes.unholy > 0) {
    parts.push(`${runes.unholy} Unholy`);
  }

  return parts.join(", ");
}
