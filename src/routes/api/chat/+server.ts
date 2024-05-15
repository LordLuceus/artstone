import { OPENAI_API_KEY } from "$env/static/private";
import { getDescription, setDescription } from "$lib/descriptions/description";
import prompt from "$lib/prompts/hs-prompt.md?raw";
import { SupportedGames } from "$lib/types/games";
import { text, type RequestHandler } from "@sveltejs/kit";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST = (async ({ request }) => {
  const { imageUrl, regenerate, id } = await request.json();

  if (!regenerate) {
    const description = await getDescription(SupportedGames.Hearthstone, id);

    if (description) {
      return text(description);
    }
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: prompt
    },
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: imageUrl }
        }
      ]
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages
  });

  const stream = OpenAIStream(response, {
    onFinal: async (c: string) => {
      await setDescription(SupportedGames.Hearthstone, id, c);
    }
  });

  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
