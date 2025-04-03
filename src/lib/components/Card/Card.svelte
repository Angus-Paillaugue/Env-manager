<script lang="ts">
  import { localizeHref } from '$lib/translations';
  import { cn } from '$lib/utils';
  import { onMount } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';
  import { Spring } from 'svelte/motion';
  import { fade } from 'svelte/transition';

  interface MyProps {
    hoverEffect?: boolean;
    overrideHref?: boolean;
  }

  type Props = ({ href: string } & SvelteHTMLElements['a']) | SvelteHTMLElements['div'];

  const {
    children,
    class: className,
    hoverEffect = false,
    overrideHref = true,
    ...restProps
  }: Props & MyProps = $props();

  let tagName = 'href' in restProps ? 'a' : 'div';
  let cursorPos = new Spring(
    { x: 0, y: 0 },
    {
      stiffness: 0.1,
      damping: 0.3
    }
  );
  let card = $state<HTMLElement | null>(null);
  let show = $state(false);

  function handleMouseMove(event: MouseEvent) {
    show = true;
    const cardRect = card?.getBoundingClientRect();
    if (!cardRect) return;
    const y = event.clientY - cardRect.top;
    const x = event.clientX - cardRect.left;
    cursorPos.set({ x, y });
  }

  function handleMouseLeave() {
    show = false;
  }

  onMount(() => {
    if (!hoverEffect) return;
    card?.addEventListener('mousemove', handleMouseMove);
    card?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card?.removeEventListener('mousemove', handleMouseMove);
      card?.removeEventListener('mouseleave', handleMouseLeave);
    };
  });

  let href = $state('href' in restProps ? restProps.href : undefined);
  if ('href' in restProps) {
    if (restProps.href && overrideHref) {
      href = localizeHref(restProps.href);
    }
  }
</script>

<svelte:element
  this={tagName}
  bind:this={card}
  class={cn(
    'bg-card border-border text-foreground relative flex flex-col rounded-lg border p-4',
    tagName === 'a' && 'hover:bg-card-hover cursor-pointer transition-colors',
    className
  )}
  {...restProps}
  {...tagName === 'a' ? { href } : {}}
>
  <div class="pointer-events-none absolute inset-0 overflow-hidden">
    {#if show}
      <div
        class="bg-foreground absolute size-8 -translate-x-1/2 -translate-y-1/2 blur-3xl"
        style="top: {cursorPos.current.y}px; left: {cursorPos.current.x}px;"
        transition:fade={{ duration: 400 }}
      ></div>
    {/if}
  </div>
  {@render children?.()}
</svelte:element>
