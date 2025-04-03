<script lang="ts">
  import { cn } from '$lib/utils';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { class: className, children, ...props }: SvelteHTMLElements['div'] = $props();
</script>

<div
  class={cn(
    'bg-card border-border flex flex-row items-center gap-2 rounded-full border px-2 py-0.5 text-sm',
    className
  )}
  {...props}
>
  {@render children?.()}
</div>
