<script lang="ts">
  import type { Docs } from '$lib/types';
  import { cn } from '$lib/utils';
  import ElementList from './elementList.svelte';

  interface MyProps {
    tree: Docs['Tree'][];
    root?: boolean;
  }

  const { tree, root = false }: MyProps = $props();
</script>

<div class={cn('flex flex-col', root ? '' : 'pl-2')}>
  {#each tree as el}
    {#if el.type === 'file'}
      <a href={el.url}>{el.name}</a>
    {:else if el.type === 'dir'}
      <span>{el.name}</span>
      <ElementList tree={el.children} />
    {/if}
  {/each}
</div>
