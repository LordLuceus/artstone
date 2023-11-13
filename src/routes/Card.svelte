<script lang="ts">
  import type { Card } from "$lib/types/card";

  export let card: Card;
</script>

<section class="card">
  <a href={`/describe/${card.cardId}`}>
    <img src={card.img} alt={card.name} />
    <h2>{`${card.name} (${card.cardSet})`}</h2>
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

  .card h2 {
    margin: 0.5rem 0;
  }
</style>
