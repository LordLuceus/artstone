import { env } from "$env/dynamic/private";
import { getDescription, setDescription } from "$lib/descriptions/description";
import prompt from "$lib/prompts/hs-prompt.md?raw";
import { SupportedGames } from "$lib/types/games";
import { createOpenAI } from "@ai-sdk/openai";
import { text, type RequestHandler } from "@sveltejs/kit";
import { streamText } from "ai";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY
});

export const POST = (async ({ request }) => {
  const { regenerate, id, imageUrl } = await request.json();

  if (!regenerate) {
    const description = await getDescription(SupportedGames.Hearthstone, id);

    if (description) {
      return text(description, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }
  }

  return streamText({
    model: openai("gpt-4o-2024-11-20"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this image."
          },
          {
            type: "image",
            image: new URL(imageUrl)
          }
        ]
      }
    ],
    system: prompt,
    temperature: 1.0,
    onFinish: async ({ text }) => await setDescription(SupportedGames.Hearthstone, id, text)
  }).toTextStreamResponse();
}) satisfies RequestHandler;
