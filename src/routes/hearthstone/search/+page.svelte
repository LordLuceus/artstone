<script lang="ts">
  import Card from "../../Card.svelte";

  export let data;
</script>

<svelte:head>
  <title>Hearthstone Card Search | Artstone</title>
  <meta name="description" content="Hearthstone card search" />
</svelte:head>

<nav>
  <a href="/">Home</a>
</nav>

<main>
  {#if data.cards}
    {#if data.cards?.length > 0}
      <div class="cards">
        <h2>Search Results</h2>
        <ul>
          {#each data.cards as card (card.id)}
            <li><Card {card} /></li>
          {/each}
        </ul>
      </div>
    {:else}
      <p>No cards found.</p>
    {/if}
  {/if}
</main>

<style>
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
