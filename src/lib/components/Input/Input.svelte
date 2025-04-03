<script lang="ts">
  import { cn, debounce as debounceFunc } from '$lib/utils';
  import type { SvelteHTMLElements } from 'svelte/elements';

  interface MyProps {
    label?: string;
    id: string;
    debounce?: number;
    onValueChange?: (val: string) => void;
  }

  let {
    class: className,
    debounce = 0,
    value = $bindable(''),
    onValueChange,
    label,
    id,
    ...restProps
  }: SvelteHTMLElements['input'] & MyProps = $props();
  const baseClasses =
    'rounded disabled:cursor-not-allowed disabled:bg-card/50 w-full bg-card border border-border placeholder-muted focus:outline-hidden outline-hidden focus:ring-2 transition-all ring-primary text-foreground px-3 py-1 text-base font-sans font-normal';

  const finalClasses = cn(baseClasses, className);

  let innerValue = $state(value);

  const handleDebounce = (val: string) => {
    value = val;
    if (onValueChange) onValueChange(val);
  };

  $effect(() => {
    innerValue = value;
  });
</script>

{#snippet input()}
  <input
    class={finalClasses}
    use:debounceFunc={{ callback: handleDebounce, delay: debounce }}
    bind:value={innerValue}
    {id}
    name={id}
    {...restProps}
  />
{/snippet}

{#if label}
  <div class="flex flex-col gap-1">
    <label for={id} class="font-sans text-sm font-medium">{label}</label>
    {@render input()}
  </div>
{:else}
  {@render input()}
{/if}
