<script lang="ts">
  import type { ScryfallCard } from "$lib/magic/types";

  interface Props {
    card: ScryfallCard;
  }

  let { card }: Props = $props();
</script>

<section class="card">
  <h1>{card.name}</h1>
  <img src={card.image_uris?.normal} alt={card.name} />
  <h2>Details</h2>
  <ul>
    {#if card.mana_cost}
      <li>Mana Cost: {card.mana_cost}</li>
    {/if}
    {#if card.type_line}
      <li>Type: {card.type_line}</li>
    {/if}
    {#if card.power}
      <li>Power / Toughness: {card.power} / {card.toughness}</li>
    {/if}
    {#if card.loyalty}
      <li>Loyalty: {card.loyalty}</li>
    {/if}
    {#if card.rarity}
      <li>Rarity: {card.rarity}</li>
    {/if}
    {#if card.set_name}
      <li>Set: {card.set_name}</li>
    {/if}
    {#if card.artist}
      <li>Artist: {card.artist}</li>
    {/if}
    {#if card.collector_number}
      <li>Collector Number: {card.collector_number}</li>
    {/if}
  </ul>

  {#if card.oracle_text}
    <h2>Card Text</h2>
    <p style="white-space: pre-wrap">{card.oracle_text}</p>
  {/if}
  {#if card.flavor_text}
    <h2>Flavour Text</h2>
    <p style="white-space: pre-wrap">{card.flavor_text}</p>
  {/if}
</section>

<style>
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
  }

  .card img {
    max-width: 100%;
    max-height: 100%;
  }
</style>
