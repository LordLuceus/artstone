<script lang="ts">
  import Card from "../../Card.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { get } from "svelte/store";

  export let data;

  function handlePageChange(event: CustomEvent<{ page: number }>) {
    const newPage = event.detail.page;
    const currentPage = get(page);

    if (currentPage.url.searchParams.get("page") !== newPage.toString()) {
      const params = new URLSearchParams(currentPage.url.search);
      params.set("page", newPage.toString());
      goto(`${currentPage.url.pathname}?${params.toString()}`);
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
        on:pageChange={handlePageChange}
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
