<script lang="ts">
  import type { Card } from "../types/card";

  export let card: Card;
</script>

<section class="card">
  <img src={card.img} alt={card.name} />
  <a href={`/describe/${card.cardId}`}>
    <h2>{`${card.name} (${card.cardSet})`}</h2>
  </a>
  <p>{@html card.text}</p>
</section>
