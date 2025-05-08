<script lang="ts">
  import { NAV_HEIGHT } from '$lib/components/home/utils';
  import Header from './header.svelte';
  import Sidebar from './sidebar.svelte';

  let { children } = $props();
</script>

<div
  class="flex w-full flex-col-reverse lg:flex-row"
  style="margin-top: {NAV_HEIGHT - 8}px; height: calc(100svh - {NAV_HEIGHT - 8}px);"
>
  <Sidebar />
  <div class="flex w-full grow flex-col overflow-auto">
    <Header />
    <main class="max-w-screen-bp mx-auto w-full p-2 lg:p-4">
      {@render children?.()}
    </main>
  </div>
</div>
