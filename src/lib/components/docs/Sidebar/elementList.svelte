<script lang="ts">
  import { page } from '$app/state';
  import type { Docs } from '$lib/types';
  import { cn } from '$lib/utils';
  import ElementList from './elementList.svelte';

  interface MyProps {
    tree: Docs['Tree'][];
    root?: boolean;
  }

  const { tree, root = false }: MyProps = $props();
</script>

<div class={cn('flex flex-col', root ? '' : 'ml-6')}>
  {#each tree as el}
    {@const active = page.url.pathname.startsWith(el.url)}
    {#if el.type === 'file'}
      <a
        href={el.url}
        class={cn(
          'text-lg font-medium',
          active ? 'text-foreground transition-colors' : 'text-muted'
        )}>{el.name}</a
      >
    {:else if el.type === 'dir'}
      <span
        class={cn(
          'text-lg font-medium transition-colors',
          active ? 'text-foreground' : 'text-muted'
        )}>{el.name}</span
      >
      <ElementList tree={el.children} />
    {/if}
  {/each}
</div>
