<script lang="ts">
  import { cn } from '$lib/utils';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  interface MyProps {
    mobile?: Snippet;
    desktop?: Snippet;
  }

  const {
    mobile,
    desktop,
    class: className,
    ...restProps
  }: MyProps & SvelteHTMLElements['aside'] = $props();
</script>

{#if mobile}
  <div class="shrink-0 p-2 lg:hidden">
    <div class="border-border bg-card grid h-12 w-full grid-cols-2 rounded-full border">
      {@render mobile()}
    </div>
  </div>
{/if}

{#if desktop}
  <div class="p-2 w-full max-w-sm shrink-0 hidden lg:flex">
    <aside
      class={cn(
        'bg-card border-border flex grow rounded-lg flex-col p-4 border',
        className
      )}
      {...restProps}
    >
      {@render desktop()}
    </aside>
  </div>
{/if}
