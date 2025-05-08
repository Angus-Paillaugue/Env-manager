<script lang="ts">
  import './code.css';
  import Sidebar from '$lib/components/docs/Sidebar';
  import Toc from '$lib/components/docs/Toc';
  import { NAV_HEIGHT, SECTION_HEIGHT } from '$lib/components/home/utils';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div
  class="flex grow flex-col gap-4 lg:flex-row"
  style="height: {SECTION_HEIGHT}; margin-top: {NAV_HEIGHT - 8}px;"
>
  <Sidebar tree={data.tree} />

  <div
    class="no-scrollbar flex grow flex-col-reverse overflow-y-auto lg:flex-row lg:overflow-hidden"
  >
    <div class="no-scrollbar flex grow flex-col max-lg:px-2 lg:overflow-y-auto">
      {@render children?.()}
    </div>

    <Toc />
  </div>
</div>
