<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import type { HearthstoneCardWithMetadata } from "$lib/types/hearthstone";
  import { useChat } from "@ai-sdk/svelte";
  import SvelteMarkdown from "svelte-markdown";
  import Card from "../../Card.svelte";
  import CardDetails from "./CardDetails.svelte";

  export let data;

  let regenerate = false;

  const { append, error, messages, reload, setMessages } = useChat({ streamProtocol: "text" });

  $: if (data.card.image) {
    sendMessage();
  }

  const handleNewDescriptionClick = () => {
    regenerate = true;
    sendMessage();
    regenerate = false;
  };

  $: description = $messages.findLast((m) => m.role === "assistant")?.content;

  let relatedCards: HearthstoneCardWithMetadata[] = [];
  let start = 0;
  const limit = 20;
  let loadCardError = false;

  const getRelatedCards = async () => {
    loadCardError = false;
    if (!data.card.childIds) return;

    try {
      const response = await fetch(
        `/api/hearthstone/related?ids=${data.card.childIds?.join(
          ","
        )}&start=${start}&limit=${limit}`
      );

      if (response.ok) {
        const data = await response.json();
        relatedCards = [...relatedCards, ...data.cards];
        start += limit;
      } else {
        loadCardError = true;
      }
    } catch (err) {
      loadCardError = true;
    }
  };

  afterNavigate(() => {
    start = 0;
    relatedCards = [];
    getRelatedCards();
  });

  function sendMessage() {
    append(
      {
        content: "Describe this card.",
        role: "user"
      },
      { body: { regenerate, id: data.card.id, imageUrl: data.card.image } }
    );
  }
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
    {#if $error}
      <p class="error">There was an error fetching the description. Please try again.</p>
      <p class="error">{$error.message}</p>
      <button on:click={() => reload()}>Try again</button>
    {:else}
      <p class="message">
        <SvelteMarkdown source={description} />
      </p>
      <button on:click={handleNewDescriptionClick}>New description</button>
    {/if}
    {#if data.card.childIds && data.card.childIds.length > 0}
      <h2>Related cards</h2>
      {#if relatedCards.length > 0}
        <ul>
          {#each relatedCards as card}
            <li>
              <Card {card} />
            </li>
          {/each}
        </ul>
        {#if relatedCards.length < data.card.childIds.length}
          <button on:click={getRelatedCards}>Load more</button>
        {/if}
      {:else if loadCardError}
        <p class="error">There was an error fetching related cards. Please try again.</p>
        <button on:click={getRelatedCards}>Try again</button>
      {:else}
        <p>Loading related cards...</p>
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

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
