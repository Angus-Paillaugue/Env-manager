<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount, type Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { slide } from 'svelte/transition';
  import { open as openMap } from './dropdown.svelte';

  interface MyPros {
    key: string;
    onOpen?: () => void;
    items: Snippet;
    trigger: Snippet;
  }

  let {
    key,
    onOpen,
    trigger,
    items,
    class: className,
    ...restProps
  }: SvelteHTMLElements['div'] & MyPros = $props();

  function onPageClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const closest = target.closest('.dropdown');
    if (closest) return;
    openMap.set(key, false);
  }

  // Call onOpen function when opening this dropdown
  $effect(() => {
    if (openMap.get(key)) {
      onOpen?.();
      return;
    }
  });

  onMount(() => {
    if (!openMap.has(key)) {
      openMap.set(key, false);
    }
  });
</script>

<svelte:window onclick={onPageClick} />

<div class={cn('dropdown relative', className)} {...restProps}>
  {@render trigger()}
  {#if openMap.get(key)}
    <div
      class="bg-card border-border absolute top-full right-0 z-20 flex h-fit w-[200px] flex-col overflow-hidden rounded border text-base font-medium *:border-t"
      transition:slide={{ axis: 'y', duration: 400 }}
    >
      {@render items()}
    </div>
  {/if}
</div>

<style>
  :global(.dropdown .dropdown-item:first-child) {
    border-top: none;
  }
</style>
