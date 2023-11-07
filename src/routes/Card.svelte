<script lang="ts">
  import type { Card } from "../types/card";

  export let card: Card;
</script>

<section class="card">
  <img src={card.img} alt={card.name} />
  <h2>{`${card.name} (${card.cardSet})`}</h2>
  <p>{@html card.text}</p>
</section>
