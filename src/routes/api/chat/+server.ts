import { getDescription, setDescription } from "$lib/descriptions/description";
import prompt from "$lib/prompts/hs-prompt.md?raw";
import { SupportedGames } from "$lib/types/games";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { type RequestHandler } from "@sveltejs/kit";
import { streamText, createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { env } from "$env/dynamic/private";

export const POST = (async ({ request }) => {
  const googleAI = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
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
    model: googleAI("gemini-3-pro-preview"),
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
