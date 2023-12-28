<script lang="ts">
  import type { HearthstoneCardWithMetadata } from "$lib/types/hearthstone";

  export let card: HearthstoneCardWithMetadata;
</script>

<section class="card">
  <a href={`/hearthstone/${card.id}`}>
    <img src={card?.image} alt={card.name} />
    <h3>{card.name}{card.cardSet ? ` (${card.cardSet.name})` : ""}</h3>
  </a>
  <p>{@html card.text}</p>
</section>

<style>
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem;
  }

  .card img {
    width: 100%;
    max-width: 300px;
    height: auto;
  }

  .card h3 {
    margin: 0.5rem 0;
  }
</style>
