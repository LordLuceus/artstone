import prompt from "$lib/prompts/hs-prompt.md?raw";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OPENAI_API_KEY } from "$env/static/private";
import { getDescription, setDescription } from "$lib/descriptions/description";
import type { RequestHandler } from "@sveltejs/kit";
import type { ChatCompletionMessageParam } from "openai/resources";
import { SupportedGames } from "$lib/types/games";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST = (async ({ request }) => {
  const { imageUrl, slug } = await request.json();

  const description = await getDescription(SupportedGames.Hearthstone, slug);

  if (description) {
    return new Response(description.description);
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

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      stream: true,
      messages,
      max_tokens: 3000
    });

    const stream = OpenAIStream(response, {
      onFinal: async (c: string) => {
        await setDescription(SupportedGames.Hearthstone, slug, { description: c });
        console.log(`Cached description for ${slug}`);
      }
    });

    return new StreamingTextResponse(stream);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}) satisfies RequestHandler;
