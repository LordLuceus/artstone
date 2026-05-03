<script lang="ts">
  import type { ScryfallCard, ScryfallCardFace } from "$lib/magic/types";

  interface Props {
    card: ScryfallCard;
    faceIndex: number;
  }

  let { card, faceIndex }: Props = $props();

  let face = $derived<ScryfallCardFace | undefined>(
    card.card_faces && card.card_faces.length > faceIndex ? card.card_faces[faceIndex] : undefined
  );

  let name = $derived(face?.name ?? card.name);
  let manaCost = $derived(face?.mana_cost ?? card.mana_cost);
  let typeLine = $derived(face?.type_line ?? card.type_line);
  let power = $derived(face?.power ?? card.power);
  let toughness = $derived(face?.toughness ?? card.toughness);
  let loyalty = $derived(face?.loyalty ?? card.loyalty);
  let oracleText = $derived(face?.oracle_text ?? card.oracle_text);
  let flavorText = $derived(face?.flavor_text ?? card.flavor_text);
  let image = $derived(
    face?.image_uris?.normal ?? card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal
  );
</script>

<section class="card">
  <h1>{name}</h1>
  <img src={image} alt={name} />
  <h2>Details</h2>
  <ul>
    {#if manaCost}
      <li>Mana Cost: {manaCost}</li>
    {/if}
    {#if typeLine}
      <li>Type: {typeLine}</li>
    {/if}
    {#if power}
      <li>Power / Toughness: {power} / {toughness}</li>
    {/if}
    {#if loyalty}
      <li>Loyalty: {loyalty}</li>
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

  {#if oracleText}
    <h2>Card Text</h2>
    <p style="white-space: pre-wrap">{oracleText}</p>
  {/if}
  {#if flavorText}
    <h2>Flavour Text</h2>
    <p style="white-space: pre-wrap">{flavorText}</p>
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
