<script lang="ts">
  import type { Card } from "../../../types/card";

  export let card: Card;
</script>

<section class="card">
  <h2>{card.name}</h2>
  <img src={card.img} alt={card.name} />
  <h3>Details</h3>
  <ul>
    <li>Set: {card.cardSet}</li>
    <li>Type: {card.type}</li>
    <li>Rarity: {card.rarity}</li>
    <li>Class: {card.playerClass}</li>
    <li>Cost: {card.cost}</li>
    <li>Attack: {card.attack}</li>
    <li>Health: {card.health}</li>
  </ul>
  <h3>Card Text</h3>
  <p>{@html card.text}</p>
  <h3>Flavour Text</h3>
  <p>{@html card.flavor}</p>
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
