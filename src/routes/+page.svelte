<script>
  import { enhance } from "$app/forms";
  import Card from "./Card.svelte";

  export let form;
</script>

<svelte:head>
  <title>Hearth Art</title>
  <meta name="description" content="Hearthstone card art described by AI" />
</svelte:head>

<h1>Hearth Art</h1>
<p>Hearthstone Card art described by AI</p>

<section role="search" class="card-search">
  <form use:enhance method="post" action="?/search">
    <input type="text" name="query" placeholder="Search for cards" autocomplete="off" />
    <button type="submit">Search</button>
  </form>
</section>

<main>
  {#if form?.cards}
    <div class="cards">
      {#each form.cards as card (card.cardId)}
        <Card {card} />
      {/each}
    </div>
  {:else}
    <p>No cards found</p>
  {/if}
</main>

<style>
  .cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    flex-direction: column;
  }

  .card-search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 2rem;
  }
</style>
