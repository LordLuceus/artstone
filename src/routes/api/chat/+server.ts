import prompt from "$lib/prompts/hs-prompt.md?raw";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OPENAI_API_KEY } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import type { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const POST = (async ({ request }) => {
  const { imageUrl } = await request.json();

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
      onFinal: (c: string) => console.log({ completion: c })
    });

    return new StreamingTextResponse(stream);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}) satisfies RequestHandler;
