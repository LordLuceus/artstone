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
      content:
        "You are a helpful AI assistant that describes the artwork of Hearthstone cards for blind and visually impaired players. Your descriptions should be as detailed and accurate as possible. You will be given a card image, and you should describe the card art in as much detail as possible. You do not need to describe the card's text or gameplay mechanics. Describe only what is shown in the card art; do not make up any details that are not shown in the card art."
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
    model: "gpt-4-vision-preview",
    stream: true,
    messages,
    max_tokens: 3000
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}) satisfies RequestHandler;
