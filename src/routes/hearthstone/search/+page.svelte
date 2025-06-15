<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Pagination from "$lib/components/Pagination.svelte";
  import Card from "../../Card.svelte";

  let { data } = $props();

  function handlePageChange(newPage: number) {
    if (page.url.searchParams.get("page") !== newPage.toString()) {
      const params = new URLSearchParams(page.url.search);
      params.set("page", newPage.toString());
      goto(`${page.url.pathname}?${params.toString()}`);
    }
  }
</script>

<svelte:head>
  <title>{`Hearthstone Card Search | Page ${data.page} | Artstone`}</title>
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
      <Pagination
        currentPage={data.page}
        totalPages={data.pageCount}
        onPageChange={handlePageChange}
      />
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
