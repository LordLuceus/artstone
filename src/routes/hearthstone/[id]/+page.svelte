<script lang="ts">
  import { useChat } from "ai/svelte";
  import SvelteMarkdown from "svelte-markdown";
  import { onMount } from "svelte";
  import CardDetails from "./CardDetails.svelte";
  import Card from "../../Card.svelte";

  export let data;

  let regenerate = false;

  const { append, error, messages, reload } = useChat({
    body: { imageUrl: data.card.image, id: data.card.id, regenerate }
  });

  onMount(() => {
    if (data.card) {
      append({ content: "Describe this card.", role: "user" });
    }
  });

  const handleNewDescriptionClick = () => {
    regenerate = true;
    reload({ options: { body: { regenerate } } });
  };
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
      <button on:click|preventDefault={() => reload()}>Try again</button>
    {:else}
      {#each $messages as message}
        {#if message.role === "assistant"}
          <p class="message">
            <SvelteMarkdown source={message.content} />
          </p>
        {/if}
      {/each}
      <button on:click|preventDefault={handleNewDescriptionClick}>New description</button>
    {/if}
    {#if data.card.relatedCards}
      <h2>Related cards</h2>
      <ul>
        {#each data.card.relatedCards as relatedCard}
          <li><Card card={relatedCard} /></li>
        {/each}
      </ul>
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
