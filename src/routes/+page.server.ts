import { hearthstoneClient } from "$lib/hearthstone/hearthstone-api";
import { addMetadata, getHearthstoneMetadata } from "$lib/hearthstone/hearthstone-metadata";
import type {
  HearthstoneCardSearchResponse,
  HearthstoneCardWithMetadata
} from "$lib/types/hearthstone";
import type { HearthstoneMetadata } from "$lib/types/hearthstone-metadata";

export const actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get("query");

    try {
      const metadata = await getHearthstoneMetadata();
      const { data } = await hearthstoneClient.cardSearch<HearthstoneCardSearchResponse>({
        textFilter: query?.toString(),
        gameMode: "constructed",
        collectible: 1,
        pageSize: 10
      });

      const cards: HearthstoneCardWithMetadata[] = filterCards(data, metadata);

      return {
        data: cards
      };
    } catch (err) {
      console.error(err);
      return {
        status: 500,
        error: "Something went wrong"
      };
    }
  }
};

function filterCards(data: HearthstoneCardSearchResponse, metadata: HearthstoneMetadata) {
  const cards: HearthstoneCardWithMetadata[] = data.cards.filter(
    (card) => card.image || card.imageGold || card.cropImage
  );

  addMetadata(cards, metadata);

  // Filter out cards without a recognised set
  const result = cards.filter((card) => card.cardSet);
  return result;
}
