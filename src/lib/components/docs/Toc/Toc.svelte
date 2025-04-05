<script lang="ts">
  import ItemsList from './itemsList.svelte';
  import { tocItems } from './toc';

  let headings = $derived($tocItems);
</script>

<div class="flex w-[300px] shrink-0 flex-col px-2">
  <ItemsList root={true} {headings} />
</div>
