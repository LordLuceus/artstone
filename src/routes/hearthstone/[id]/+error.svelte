<script lang="ts">
  import { page } from "$app/stores";
</script>

<svelte:head>
  <title>Error | Artstone</title>
  <meta name="description" content="Hearthstone card art described by AI" />
</svelte:head>

<h1>Whoops!</h1>
<h2>Looks like something went wrong. Sorry for the inconvenience.</h2>
<p>{$page.status}: {$page.error?.message}</p>
<a href="/">Return to home page</a>
