<script>
  import { enhance } from "$app/forms";
  import Card from "./Card.svelte";

  export let form;
</script>

<svelte:head>
  <title>Artstone</title>
  <meta name="description" content="Hearthstone card art described by AI" />
</svelte:head>

<h1>Artstone</h1>
<p>Hearthstone Card art described by AI</p>

<section role="search" class="card-search">
  <form use:enhance method="post" action="?/search">
    <input type="text" name="query" placeholder="Search for cards" autocomplete="off" />
    <button type="submit">Search</button>
  </form>
</section>

<main>
  {#if form?.data}
    <div class="cards">
      <ul>
        {#each form.data as card (card.cardId)}
          <li><Card {card} /></li>
        {/each}
      </ul>
    </div>
  {:else if form?.error}
    <p>No cards found.</p>
  {:else}
    <p>Cards will appear here.</p>
  {/if}
</main>

<style>
  .card-search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
</style>
