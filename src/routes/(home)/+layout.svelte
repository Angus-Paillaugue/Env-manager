<script lang="ts">
  import Navbar from '../navbar.svelte';

  let { children } = $props();
</script>

<Navbar />

<main class="flex h-full grow flex-col min-h-svh">
  {@render children?.()}
</main>
