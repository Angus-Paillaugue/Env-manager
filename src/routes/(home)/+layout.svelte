<script lang="ts">
  import Navbar from './navbar.svelte';

  let { children } = $props();
</script>

<div class="flex flex-col h-svh">
  <Navbar />

  <div class="p-2 lg:p-4 !pt-0 h-full overflow-hidden grow flex flex-col">
    <main class="rounded-lg overflow-y-auto overflow-x-hidden grow border-border border no-scrollbar">
      {@render children?.()}
    </main>
  </div>
</div>
