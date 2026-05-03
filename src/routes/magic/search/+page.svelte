<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { magicColours, magicFormats } from "$lib/magic/card";
  import Pagination from "$lib/components/Pagination.svelte";
  import Card from "../../Card.svelte";

  let { data } = $props();

  let query = $state("");
  let selectedColours = $state<string[]>([]);
  let selectedSet = $state("");
  let selectedFormat = $state("");

  let canSearch = $derived(
    query.trim().length > 0 ||
      selectedColours.length > 0 ||
      selectedSet !== "" ||
      selectedFormat !== ""
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
    selectedColours.forEach((c) => params.append("colour", c));
    if (selectedSet) params.set("set", selectedSet);
    if (selectedFormat) params.set("format", selectedFormat);

    params.set("page", "1");
    goto(`/magic/search?${params.toString()}`);
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
        placeholder="Search for cards"
        autocomplete="off"
        bind:value={query}
      />
      <fieldset>
        <legend>Colours</legend>
        <ul>
          {#each magicColours as c}
            <li>
              <label>
                <input type="checkbox" value={c.value} bind:group={selectedColours} />
                {c.label}
              </label>
            </li>
          {/each}
        </ul>
      </fieldset>
      <fieldset>
        <legend>Set</legend>
        <select bind:value={selectedSet}>
          <option value="">All Sets</option>
          {#each data.sets as s}
            <option value={s.code}>{s.name}</option>
          {/each}
        </select>
      </fieldset>
      <fieldset>
        <legend>Format</legend>
        <select bind:value={selectedFormat}>
          {#each magicFormats as f}
            <option value={f.value}>{f.label}</option>
          {/each}
        </select>
      </fieldset>
      <button type="submit" disabled={!canSearch}>Search</button>
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

  .search-form fieldset {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .search-form fieldset ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
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
