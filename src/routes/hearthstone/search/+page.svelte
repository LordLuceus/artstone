<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { toDisplayCard } from "$lib/hearthstone/display";
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
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
      if (params.has(key)) {
        params.set(key, `${params.get(key)},${value}`);
      } else {
        params.set(key, value.toString());
      }
    });

    params.set("page", "1");
    const url = `/hearthstone/search?${params.toString()}`;
    goto(url);
  }
</script>

<svelte:head>
  <title
    >{data.page
      ? `Hearthstone Card Search | Page ${data.page} | Artstone`
      : "Hearthstone Card Search | Artstone"}</title
  >
  <meta name="description" content="Hearthstone card search" />
</svelte:head>

<nav>
  <a href="/">Home</a>
</nav>

<main>
  <section role="search" class="card-search">
    <form class="search-form" onsubmit={handleSubmit}>
      <fieldset>
        <legend><h2>Classes</h2></legend>
        <ul>
          {#each data.metadata.classes as c (c.id)}
            <li>
              <label>
                <input type="checkbox" name="class" value={c.slug} />
                {c.name}
              </label>
            </li>
          {/each}
        </ul>
      </fieldset>
      <fieldset>
        <legend><h2>Sets</h2></legend>
        <select name="set">
          <option value="">All Sets</option>
          <option value="standard">Standard Sets</option>
          {#each data.metadata.sets as s (s.id)}
            <option value={s.slug}>
              {s.name}
            </option>
          {/each}
        </select>
      </fieldset>
      <input type="text" name="query" placeholder="Search for cards" autocomplete="off" />
      <button type="submit">Search</button>
    </form>
  </section>

  {#if data.cards}
    {#if data.cards?.length > 0}
      <div class="cards">
        <h2>Search Results</h2>
        <ul>
          {#each data.cards as card (card.id)}
            <li><Card card={toDisplayCard(card)} game="hearthstone" /></li>
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
