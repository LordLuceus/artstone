<svelte:head>
  <title>Artstone</title>
  <meta name="description" content="Hearthstone card art described by AI" />
</svelte:head>

<h1>Artstone</h1>
<p>Hearthstone Card art described by AI</p>

<section role="search" class="card-search">
  <form action="/hearthstone/search" class="search-form">
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
</style>
