<script lang="ts">
  import { useChat } from "ai/svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { onMount } from "svelte";
  import CardDetails from "./CardDetails.svelte";

  export let data;

  const { append, messages } = useChat({
    body: { imageUrl: data.card.image }
  });

  onMount(() => {
    if (data.card) {
      append({ content: "Describe this card.", role: "user" });
    }
  });
</script>

<svelte:head>
  <title>{`${data.card?.name} | Artstone`}</title>
  <meta name="description" content={`The Artstone card details page for ${data.card?.name}`} />
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
        <p class="message">
          <SvelteMarkdown source={message.content} />
        </p>
      {/if}
    {/each}
  {:else}
    <p>Card details will appear here.</p>
  {/if}
</main>
