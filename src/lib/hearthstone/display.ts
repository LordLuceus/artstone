import type { HearthstoneCardWithMetadata } from "$lib/types/hearthstone";
import type { DisplayCard } from "$lib/types/display-card";

export function toDisplayCard(card: HearthstoneCardWithMetadata): DisplayCard {
  return {
    id: card.id,
    name: card.name,
    image: card.image,
    text: card.text,
    setName: card.cardSet?.name
  };
}
