import hearthstone from "$lib/hearthstone-api";
import type { Card } from "$lib/types/card";

export const actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get("query");

    try {
      const { data } = await hearthstone.get<Card[]>(`/search/${query}?collectible=1`);

      return {
        data
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
