<script lang="ts">
  import './code.css';
  import Sidebar from '$lib/components/docs/Sidebar';
  import Toc from '$lib/components/docs/Toc';
  import { SECTION_HEIGHT } from '$lib/components/home/utils';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<div class="flex grow flex-col-reverse gap-4 lg:flex-row" style="height: {SECTION_HEIGHT};">
  <Sidebar tree={data.tree} />

  <div
    class="no-scrollbar flex grow flex-col-reverse overflow-y-auto lg:flex-row lg:overflow-hidden"
  >
    <main class="no-scrollbar flex grow flex-col max-lg:px-2 lg:overflow-y-auto">
      {@render children?.()}
    </main>

    <Toc />
  </div>
</div>
