<script lang="ts">
  import { cn } from '$lib/utils';
  import ItemsList from './itemsList.svelte';
  import type { TOCEntry } from './toc';

  interface MyProps {
    headings: TOCEntry[];
    root?: boolean;
  }

  const { headings, root = false }: MyProps = $props();
</script>

<ol class={cn(!root && 'ml-2')}>
  {#each headings as heading}
    <li class="mb-2 list-none first:mt-2 last:m-0">
      <a
        href={'#' + heading.id}
        class={cn('hover:text-primary mt-1 max-w-[50px] transition-colors', !root && 'px-1')}
      >
        {heading.title}
      </a>
      {#if heading.children.length > 0}
        <ItemsList headings={heading.children} />
      {/if}
    </li>
  {/each}
</ol>
