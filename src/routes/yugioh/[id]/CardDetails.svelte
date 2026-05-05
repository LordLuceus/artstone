<script lang="ts">
  import type { YGOCard } from "$lib/yugioh/types";

  interface Props {
    card: YGOCard;
    imageUrl: string | undefined;
  }

  let { card, imageUrl }: Props = $props();
</script>

<section class="card">
  <h1>{card.name}</h1>
  <img src={imageUrl} alt={card.name} />
  <h2>Details</h2>
  <ul>
    <li>Type: {card.type}</li>
    {#if card.attribute}
      <li>Attribute: {card.attribute}</li>
    {/if}
    {#if card.race}
      <li>Race: {card.race}</li>
    {/if}
    {#if card.level}
      <li>Level: {card.level}</li>
    {/if}
    {#if card.atk !== undefined}
      <li>ATK: {card.atk}</li>
    {/if}
    {#if card.def !== undefined}
      <li>DEF: {card.def}</li>
    {/if}
    {#if card.scale}
      <li>Scale: {card.scale}</li>
    {/if}
    {#if card.linkval}
      <li>Link Value: {card.linkval}</li>
    {/if}
    {#if card.linkmarkers && card.linkmarkers.length > 0}
      <li>Link Markers: {card.linkmarkers.join(", ")}</li>
    {/if}
    {#if card.archetype}
      <li>Archetype: {card.archetype}</li>
    {/if}
  </ul>

  {#if card.desc}
    <h2>Card Text</h2>
    <p style="white-space: pre-wrap">{card.desc}</p>
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
