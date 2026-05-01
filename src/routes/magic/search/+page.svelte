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

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const query = formData.get("query")?.toString() || "";
    const url = `/magic/search?query=${encodeURIComponent(query)}&page=1`;
    goto(url);
  }

  async function handleRandomCard() {
    const response = await fetch("/api/magic/random");
    if (response.ok) {
      const { id } = await response.json();
      goto(`/magic/${id}`);
    }
  }
</script>

<svelte:head>
  <title
    >{data.page
      ? `Magic Card Search | Page ${data.page} | Artstone`
      : "Magic Card Search | Artstone"}</title
  >
  <meta name="description" content="Magic: The Gathering card search" />
</svelte:head>

<nav>
  <a href="/">Home</a>
</nav>

<main>
  <section role="search" class="card-search">
    <form class="search-form" onsubmit={handleSubmit}>
      <input
        type="text"
        name="query"
        placeholder="Search for cards (e.g. t:creature c:U)"
        autocomplete="off"
      />
      <button type="submit">Search</button>
      <button type="button" onclick={handleRandomCard}>Random card</button>
    </form>
  </section>

  {#if data.cards}
    {#if data.cards?.length > 0}
      <div class="cards">
        <h2>Search Results</h2>
        <ul>
          {#each data.cards as card (card.id)}
            <li><Card {card} game="magic" /></li>
          {/each}
        </ul>
      </div>
      <Pagination
        currentPage={data.page}
        totalPages={data.pageCount}
        onPageChange={handlePageChange}
      />
    {:else if data.page > 0}
      <p>No cards found.</p>
    {:else}
      <p>Use the search form above to find cards.</p>
    {/if}
  {/if}
</main>

<style>
  .card-search {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .search-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
