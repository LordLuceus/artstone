<script lang="ts">
  import { goto } from "$app/navigation";

  let { data } = $props();

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
  <title>Artstone</title>
  <meta name="description" content="Hearthstone card lookup and AI art descriptions" />
</svelte:head>

<h1>Artstone</h1>
<p>Hearthstone Card lookup and AI art descriptions</p>

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
</style>
