<script lang="ts">
  import { getCardImage } from "$lib/magic/card";
  import { Chat } from "@ai-sdk/svelte";
  import { DefaultChatTransport } from "ai";
  import Markdown from "svelte-exmarkdown";
  import CardDetails from "./CardDetails.svelte";
  import { SupportedGames } from "$lib/types/games";

  let { data } = $props();

  let regenerate = false;

  const chat = new Chat({ transport: new DefaultChatTransport({ api: "/api/chat" }) });

  const handleNewDescriptionClick = () => {
    regenerate = true;
    chat.messages = [];
    sendMessage();
    regenerate = false;
  };

  function sendMessage() {
    chat.sendMessage(
      {
        parts: [{ type: "text", text: "Describe this card." }],
        role: "user"
      },
      {
        body: {
          regenerate,
          cardId: data.card.id,
          imageUrl: getCardImage(data.card),
          game: SupportedGames.Magic
        }
      }
    );
  }

  let lastCardId = $state<string | null>(null);

  $effect(() => {
    if (getCardImage(data.card) && data.card.id !== lastCardId) {
      lastCardId = data.card.id;
      chat.messages = [];
      sendMessage();
    }
  });

  let description = $derived(
    chat.messages.findLast((m) => m.role === "assistant")?.parts.find((p) => p.type === "text")
      ?.text
  );

  let isGenerating = $derived(chat.status === "streaming" || chat.status === "submitted");
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
    {#if description || isGenerating}
      <h2>Description</h2>
      {#if chat.error}
        <p class="error">There was an error fetching the description. Please try again.</p>
        <p class="error">{chat.error.message}</p>
        <button onclick={() => chat.regenerate()}>Try again</button>
      {:else if isGenerating && !description}
        <p class="message">Generating description...</p>
      {:else if description}
        <p class="message">
          <Markdown md={description} />
        </p>
        <button onclick={handleNewDescriptionClick} disabled={isGenerating}>New description</button>
      {/if}
    {/if}
  {:else}
    <p>Card details will appear here.</p>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background-color: #fff;
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.1);
  }

  nav a {
    color: #000;
    text-decoration: none;
  }

  nav a:hover {
    text-decoration: underline;
  }

  main h2 {
    margin-top: 2rem;
  }

  main p {
    margin: 0;
  }

  .message {
    margin: 0;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #eee;
  }

  .error {
    color: red;
  }
</style>
