import { getDescription, setDescription } from "$lib/descriptions/description";
import hsPrompt from "$lib/prompts/hs-prompt.md?raw";
import magicPrompt from "$lib/prompts/magic-prompt.md?raw";
import { SupportedGames } from "$lib/types/games";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { type RequestHandler } from "@sveltejs/kit";
import { streamText, createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { env } from "$env/dynamic/private";

const prompts: Record<SupportedGames, string> = {
  [SupportedGames.Hearthstone]: hsPrompt,
  [SupportedGames.Magic]: magicPrompt,
  [SupportedGames.YuGiOh]: hsPrompt
};

export const POST = (async ({ request }) => {
  const googleAI = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });
  const { regenerate, cardId, imageUrl, game, face } = await request.json();

  const gameKey = (game as SupportedGames) || SupportedGames.Hearthstone;
  const prompt = prompts[gameKey];

  if (!regenerate) {
    const description = await getDescription(gameKey, cardId, face);

    if (description) {
      const messageId = "cached-" + Date.now();
      const stream = createUIMessageStream({
        execute({ writer }) {
          writer.write({ type: "start" });
          writer.write({ type: "start-step" });
          writer.write({
            type: "text-start",
            id: messageId
          });
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
    onFinish: async ({ text }) => await setDescription(gameKey, cardId, text, face)
  });

  return createUIMessageStreamResponse({ stream: result.toUIMessageStream() });
}) satisfies RequestHandler;
