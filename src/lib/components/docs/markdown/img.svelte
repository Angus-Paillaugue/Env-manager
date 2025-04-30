<script lang="ts">
  import { Modal } from '$lib/components';
  import { t } from '$lib/translations';
  import { scale } from 'svelte/transition';

  const { src, alt, 'data-caption': caption } = $props();
  let zoomed = $state(false);
</script>

<button
  aria-label={$t('components.docs.markdown.img.zoom')}
  onclick={() => (zoomed = true)}
  class="border-border bg-card mb-4 rounded border p-2"
>
  <figure>
    <img {src} {alt} class="cursor-zoom-in rounded object-contain" />
    {#if caption}
      <figcaption
        class="text-muted relative mt-2 block justify-center rounded-xl px-8 text-center text-base"
      >
        {caption}
      </figcaption>
    {/if}
  </figure>
</button>

<Modal.Backdrop bind:open={zoomed} />

{#if zoomed}
  <img
    {src}
    {alt}
    class="pointer-events-none fixed top-1/2 left-1/2 z-40 h-auto max-h-full w-auto max-w-full -translate-x-1/2 -translate-y-1/2 object-contain"
    transition:scale
  />
{/if}
