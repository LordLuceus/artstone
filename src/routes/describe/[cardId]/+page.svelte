<script>
  import CardDetails from "./CardDetails.svelte";

  export let data;
</script>

<svelte:head>
  <title>{`${data.card?.name} | Artstone`}</title>
  <meta name="description" content={`The Artstone card description page for ${data.card?.name}`} />
</svelte:head>

<nav>
  <a href="/">Home</a>
</nav>

<main>
  {#if data.card}
    <CardDetails card={data.card} />
  {:else}
    <p>Card details will appear here.</p>
  {/if}
</main>
