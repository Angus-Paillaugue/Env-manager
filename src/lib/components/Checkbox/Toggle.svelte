<script lang="ts">
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let {
    checked = $bindable(),
    id,
    class: className,
    ...restProps
  }: SvelteHTMLElements['input'] = $props();
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });
</script>

{#if mounted}
  <label for={id} class={cn('relative inline-flex h-6 w-12 shrink-0 flex-row', className)}>
    <input type="checkbox" {id} name={id} class="peer sr-only" bind:checked {...restProps} />
    <div
      class={cn(
        'absolute inset-0 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-card-foreground'
      )}
    ></div>
    <span
      class={cn(
        'absolute top-0.5 bottom-0.5 left-0.5 aspect-square rounded-full bg-white transition-all peer-checked:translate-x-[calc(100%+0.25rem)]'
      )}
    ></span>
  </label>
{:else}
  <div
    class={cn(
      'bg-card-foreground relative inline-flex h-6 w-12 shrink-0 animate-pulse flex-row rounded-full',
      className
    )}
  ></div>
{/if}
