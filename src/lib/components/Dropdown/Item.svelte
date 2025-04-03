<script lang="ts">
  import { cn } from '$lib/utils';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className, ...restProps }: SvelteHTMLElements['button'] = $props();
</script>

<button
  class={cn(
    'hover:bg-card-hover text-foreground border-border dropdown-item flex w-full grow cursor-pointer flex-row items-center gap-2 p-2 text-left font-sans text-base transition-colors',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</button>
