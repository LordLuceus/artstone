<script lang="ts">
  import type { DisplayCard } from "$lib/types/display-card";

  interface Props {
    card: DisplayCard;
    game: string;
  }

  let { card, game }: Props = $props();
</script>

<section class="card">
  <a href={`/${game}/${card.id}`}>
    <img src={card?.image} alt={card.name} />
    <h3>{card.name}{card.setName ? ` (${card.setName})` : ""}</h3>
  </a>
  {#if card.text}
    <p>{@html card.text}</p>
  {/if}
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
