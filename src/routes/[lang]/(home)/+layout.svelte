<script lang="ts">
  import { SECTION_HEIGHT } from '$lib/components/home/utils';
  import Footer from './footer.svelte';
  import Navbar from './navbar.svelte';

  let { children } = $props();
</script>

<div class="flex h-svh flex-col">
  <Navbar />

  <div class="flex h-full grow flex-col overflow-hidden p-2 !pt-0 lg:p-4">
    <main
      class="border-border no-scrollbar grow overflow-x-hidden overflow-y-auto rounded-lg border"
    >
      <div class="flex flex-col" style="min-height: {SECTION_HEIGHT};">
        {@render children?.()}
      </div>
      <Footer />
    </main>
  </div>
</div>
