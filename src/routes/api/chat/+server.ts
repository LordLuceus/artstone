import { env } from "$env/dynamic/private";
import { getDescription, setDescription } from "$lib/descriptions/description";
import prompt from "$lib/prompts/hs-prompt.md?raw";
import { SupportedGames } from "$lib/types/games";
import { createOpenAI } from "@ai-sdk/openai";
import { type RequestHandler } from "@sveltejs/kit";
import { streamText, createUIMessageStream, createUIMessageStreamResponse } from "ai";

const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY
});

export const POST = (async ({ request }) => {
  const { regenerate, cardId, imageUrl } = await request.json();

  if (!regenerate) {
    const description = await getDescription(SupportedGames.Hearthstone, cardId);

    if (description) {
      // Create a proper UIMessage stream matching the real format
      const messageId = "cached-" + Date.now();
      const stream = createUIMessageStream({
        execute({ writer }) {
          writer.write({ type: "start" });
          writer.write({ type: "start-step" });
          writer.write({
            type: "text-start",
            id: messageId
          });
          // Split description into small chunks to simulate streaming
          const chunkSize = 10;
          for (let i = 0; i < description.length; i += chunkSize) {
            writer.write({
              type: "text-delta",
              id: messageId,
              delta: description.slice(i, i + chunkSize)
            });
          }
          writer.write({
            type: "text-end",
            id: messageId
          });
          writer.write({ type: "finish-step" });
          writer.write({ type: "finish", finishReason: "stop" });
        }
      });
      return createUIMessageStreamResponse({ stream });
    }
  }

  const result = streamText({
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
    onFinish: async ({ text }) => await setDescription(SupportedGames.Hearthstone, cardId, text)
  });

  return createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
}) satisfies RequestHandler;
