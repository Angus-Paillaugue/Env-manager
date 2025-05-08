<script lang="ts">
  import { cn } from '$lib/utils';
  import ItemsList from './itemsList.svelte';
  import type { TOCEntry } from './toc';

  interface MyProps {
    headings: TOCEntry[];
    activeSectionId: string | null;
    root?: boolean;
  }

  const { headings, root = false, activeSectionId = null }: MyProps = $props();
</script>

<ol class={cn(!root && 'ml-4')}>
  {#each headings as heading}
    <li class="my-2 list-none">
      <a
        href={'#' + heading.id}
        class={cn(
          'hover:text-primary text-muted transition-colors',
          activeSectionId === heading.id && 'text-primary'
        )}
      >
        {heading.title}
      </a>
      {#if heading.children.length > 0}
        <ItemsList {activeSectionId} headings={heading.children} />
      {/if}
    </li>
  {/each}
</ol>
