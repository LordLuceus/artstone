<script lang="ts">
  interface Props {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }

  let { totalPages, currentPage, onPageChange }: Props = $props();

  function goToPage(page: number) {
    onPageChange(page);
  }

  function previous() {
    if (currentPage > 1) goToPage(currentPage - 1);
  }

  function next() {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  }

  const pageRange = $derived.by(() => {
    let rangeSize = 10; // Max number of pages to display in the range
    let start = 1;
    let end = totalPages <= rangeSize ? totalPages : Math.min(start + rangeSize - 1, totalPages);

    if (totalPages > rangeSize) {
      // Calculate start and end to keep currentPage centered
      start = Math.max(currentPage - Math.floor(rangeSize / 2), 1);
      end = Math.min(start + rangeSize - 1, totalPages);

      // Adjust if end exceeds totalPages
      if (end > totalPages) {
        end = totalPages;
        start = Math.max(end - rangeSize + 1, 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });
</script>

<nav class="pagination">
  <p>Showing page {currentPage} of {totalPages}</p>
  <button onclick={previous} disabled={currentPage === 1}>Previous</button>
  <button onclick={() => goToPage(1)} disabled={currentPage === 1}>First</button>
  {#each pageRange as page}
    <button
      class:active={page === currentPage}
      onclick={() => goToPage(page)}
      aria-current={page === currentPage ? "page" : undefined}
    >
      {page}
    </button>
  {/each}
  <button onclick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
  <button onclick={next} disabled={currentPage === totalPages}>Next</button>
</nav>

<style>
  .pagination {
    display: flex;
    gap: 8px;
  }
  .active {
    font-weight: bold;
  }
</style>
