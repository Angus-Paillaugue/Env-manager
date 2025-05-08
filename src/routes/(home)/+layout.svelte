<script lang="ts">
  import Navbar from '../navbar.svelte';

  let { children } = $props();
</script>

<Navbar />

<main class="flex h-full min-h-svh grow flex-col">
  {@render children?.()}
</main>
