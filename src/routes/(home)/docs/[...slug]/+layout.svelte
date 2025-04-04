<script lang="ts">
  import Sidebar from '$lib/components/docs/Sidebar';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="flex flex-row gap-4">
  <Sidebar tree={data.tree} />
  <div class="block">
    {@render children?.()}
  </div>
</div>
