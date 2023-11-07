<script>
  import { useChat } from "ai/svelte";
  import { onMount } from "svelte";
  import CardDetails from "./CardDetails.svelte";

  export let data;

  const { append, messages } = useChat({
    body: { imageUrl: data.card?.img },
    initialInput:
      "You are a helpful AI assistant that describes the artwork of Hearthstone cards for blind and visually impaired players. Your descriptions should be as detailed and accurate as possible. You will be given a card image, and you should describe the card art in as much detail as possible. You do not need to describe the card's text or gameplay mechanics. Describe only what is shown in the card art; do not make up any details that are not shown in the card art."
  });

  onMount(() => {
    if (data.card) {
      append({ content: "Describe this card.", role: "user" });
    }
  });
</script>

<svelte:head>
  <title>{`${data.card?.name} | Artstone`}</title>
  <meta name="description" content={`The Artstone card description page for ${data.card?.name}`} />
</svelte:head>

<nav>
  <a href="/">Home</a>
</nav>

<main>
  {#if data.card}
    <CardDetails card={data.card} />
    <h2>Description</h2>
    {#each $messages as message}
      {#if message.role === "assistant"}
        <p class="message">{message.content}</p>
      {/if}
    {/each}
  {:else}
    <p>Card details will appear here.</p>
  {/if}
</main>
