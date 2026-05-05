<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Pagination from "$lib/components/Pagination.svelte";
  import Card from "../../Card.svelte";

  let { data } = $props();

  let query = $state("");
  let selectedType = $state("");
  let selectedAttribute = $state("");
  let selectedArchetype = $state("");

  let canSearch = $derived(
    query.trim().length > 0 ||
      selectedType !== "" ||
      selectedAttribute !== "" ||
      selectedArchetype !== ""
  );

  function handlePageChange(newPage: number) {
    if (page.url.searchParams.get("page") !== newPage.toString()) {
      const params = new URLSearchParams(page.url.search);
      params.set("page", newPage.toString());
      goto(`${page.url.pathname}?${params.toString()}`);
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!canSearch) return;

    const params = new URLSearchParams();

    if (query.trim()) params.set("query", query.trim());
    if (selectedType) params.set("type", selectedType);
    if (selectedAttribute) params.set("attribute", selectedAttribute);
    if (selectedArchetype) params.set("archetype", selectedArchetype);

    params.set("page", "1");
    goto(`/yugioh/search?${params.toString()}`);
  }
</script>

<svelte:head>
  <title
    >{data.page
      ? `Yu-Gi-Oh! Card Search | Page ${data.page} | Artstone`
      : "Yu-Gi-Oh! Card Search | Artstone"}</title
  >
  <meta name="description" content="Yu-Gi-Oh! card search" />
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
        placeholder="Search for cards"
        autocomplete="off"
        bind:value={query}
      />
      <fieldset>
        <legend>Type</legend>
        <select bind:value={selectedType}>
          <option value="">All Types</option>
          {#each data.types as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </fieldset>
      <fieldset>
        <legend>Attribute</legend>
        <select bind:value={selectedAttribute}>
          <option value="">All Attributes</option>
          {#each data.attributes as a}
            <option value={a}>{a}</option>
          {/each}
        </select>
      </fieldset>
      <fieldset>
        <legend>Archetype</legend>
        <select bind:value={selectedArchetype}>
          <option value="">All Archetypes</option>
          {#each data.archetypes as a}
            <option value={a}>{a}</option>
          {/each}
        </select>
      </fieldset>
      <button type="submit" disabled={!canSearch}>Search</button>
    </form>
  </section>

  {#if data.cards}
    {#if data.cards?.length > 0}
      <div class="cards">
        <h2>Search Results</h2>
        <ul>
          {#each data.cards as card (card.id)}
            <li><Card {card} game="yugioh" /></li>
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

  .search-form fieldset {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
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
