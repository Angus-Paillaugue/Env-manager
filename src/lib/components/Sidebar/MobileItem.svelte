<script lang="ts">
  import { cn } from '$lib/utils';
  import type { SvelteHTMLElements } from 'svelte/elements';

  const { children, class: className, ...restProps }: SvelteHTMLElements['a'] = $props();
</script>

<a
  class={cn(
    'flex h-full w-full flex-row items-center justify-center gap-2 font-mono text-base font-medium',
    className
  )}
  {...restProps}
>
  {@render children?.()}
</a>
