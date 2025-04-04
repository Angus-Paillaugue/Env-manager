<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let currentPage = $derived(data.page);
</script>

{@render currentPage.component()}
