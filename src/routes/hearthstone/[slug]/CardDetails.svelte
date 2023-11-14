<script lang="ts">
  import type { HearthstoneCardWithMetadata } from "$lib/types/hearthstone";
  import { formatRunes } from "$lib/hearthstone/rune-parser";

  export let card: HearthstoneCardWithMetadata;
</script>

<section class="card">
  <h1>{card.name}</h1>
  <img src={card.image} alt={card.name} />
  <h2>Details</h2>
  <ul>
    <li>Class: {card.classes?.map((c) => c.name).join(", ")}</li>
    {#if card.cardType}
      <li>Type: {card.cardType.name}</li>
    {/if}
    {#if card.rarity}
      <li>Rarity: {card.rarity.name}</li>
    {/if}
    <li>Cost: {card.manaCost}</li>
    {#if card.attack}
      <li>Attack: {card.attack}</li>
    {/if}
    {#if card.health}
      {#if card.cardType?.name === "Location"}
        <li>Durability: {card.health}</li>
      {:else}
        <li>Health: {card.health}</li>
      {/if}
    {/if}
    {#if card.durability}
      <li>Durability: {card.durability}</li>
    {/if}
    {#if card.armor}
      <li>Armor: {card.armor}</li>
    {/if}
    {#if card.minionTypes && card.minionTypes.length > 0}
      <li>Minion Types: {card.minionTypes.map((mt) => mt.name).join(", ")}</li>
    {/if}
    {#if card.spellSchool}
      <li>Spell School: {card.spellSchool.name}</li>
    {/if}
    {#if card.runeCost}
      <li>Runes: {formatRunes(card.runeCost)}</li>
    {/if}
    {#if card.cardSet}
      <li>Set: {card.cardSet.name}</li>
    {/if}
    {#if card.artistName}
      <li>Artist: {card.artistName}</li>
    {/if}
  </ul>

  {#if card.text}
    <h2>Card Text</h2>
    <p>{@html card.text}</p>
  {/if}
  {#if card.flavorText}
    <h2>Flavour Text</h2>
    <p>{@html card.flavorText}</p>
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
