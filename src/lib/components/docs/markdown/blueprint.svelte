<script module lang="ts">
  import { a, img, pre, table } from './';

  export { pre, img, a, table };
</script>

<script lang="ts">
  const { children, ...metadata } = $props();
</script>

{#if metadata?.description}
  <section class="mb-8">
    {#if metadata?.description}
      <p class="m-0 text-lg">{metadata.description}</p>
    {/if}
  </section>
{/if}

{@render children?.()}
