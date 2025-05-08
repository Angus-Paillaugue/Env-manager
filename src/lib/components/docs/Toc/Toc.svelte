<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import Modal from '$lib/components/Modal';
  import { cn, isMobile } from '$lib/utils';
  import { ChevronUp } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { Spring } from 'svelte/motion';
  import { slide } from 'svelte/transition';
  import ItemsList from './itemsList.svelte';
  import { tocItems } from './toc';

  let headings = $derived($tocItems);
  let indicatorPos = new Spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.25 });
  let headingScrolls = $state<Array<{ id: string; offset: number; level: number }>>([]);
  const topTriggerOffset = 82;
  let activeSectionHeading = $state<HTMLElement | null>(null);
  let mobileVisible = $state(false);
  let scrollContainer = $state<HTMLElement | null>(null);
  let scrollPercentage = $state(0);

  function main() {
    headingScrolls = [];
    setTopPos(headings);
    const docsContainerElement = document.getElementById('docsContainer') as HTMLElement;
    scrollContainer = (
      isMobile.current
        ? docsContainerElement.parentElement?.parentElement
        : docsContainerElement.parentElement
    ) as HTMLElement;
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });

    // Reset the active heading indicator if the page is shorter than the viewport
    if (document.body.scrollHeight <= window.innerHeight) {
      indicatorPos.set({ x: 0, y: 0 });
    }

    windowScrollHandler();
    scrollContainer.removeEventListener('scroll', () => windowScrollHandler());
    scrollContainer.addEventListener('scroll', () => windowScrollHandler());

    return scrollContainer;
  }

  afterNavigate(() => {
    let scrollContainer = main();
    window.addEventListener('resize', main);
    return () => {
      scrollContainer.removeEventListener('scroll', () => windowScrollHandler());
      window.removeEventListener('resize', main);
    };
  });

  onMount(() => {
    window.addEventListener('resize', main);
    return () => {
      if (scrollContainer)
        scrollContainer.removeEventListener('scroll', () => windowScrollHandler());
      window.removeEventListener('resize', main);
    };
  });

  function windowScrollHandler() {
    if (!scrollContainer) return;
    const maxScrollPosition = scrollContainer.scrollHeight - window.innerHeight;
    const scrollPosition = scrollContainer.scrollTop;
    // Calculate the progress based on how much the user has scrolled relative to the maximum scroll position
    const progress = Math.abs((isMobile.current ? 1 : 0) + scrollPosition / maxScrollPosition);
    scrollPercentage = progress * 100;

    // Interpolate the trigger value between offset and scrollContainer.innerHeight
    // As progress goes from 0 to 1, trigger smoothly moves from scrollPosition + offset to scrollPosition + scrollContainer.innerHeight
    const trigger =
      scrollPosition +
      topTriggerOffset +
      progress * (scrollContainer.clientHeight - topTriggerOffset);
    let activeHeadingInSidebar: (typeof headingScrolls)[0] | null = null;

    // Find the lowest heading that is above the trigger
    for (let i in headingScrolls) {
      if (headingScrolls[i].offset <= trigger) {
        activeHeadingInSidebar = headingScrolls[i];
      }
    }
    if (activeHeadingInSidebar) {
      indicatorPos.set({
        y: headingScrolls.indexOf(activeHeadingInSidebar),
        x: activeHeadingInSidebar.level
      });
      activeSectionHeading = document.getElementById(activeHeadingInSidebar.id);
    } else {
      // If no heading is found, set the indicator to the top
      indicatorPos.set({ y: 0, x: 0 });
      activeSectionHeading = document.getElementById(headings[0].id);
    }
  }

  function setTopPos(h: typeof headings) {
    h.forEach((e) => {
      const element = document.getElementById(e.id);
      if (!element) return;
      headingScrolls.push({
        id: e.id,
        offset: element.getBoundingClientRect().top + window.scrollY,
        level: e.level - 1
      });

      if (e.children.length > 0) {
        setTopPos(e.children);
      }
    });
    headingScrolls.sort((a, b) => a.offset - b.offset);
  }
</script>

<Modal.Backdrop bind:open={mobileVisible} class="lg:hidden" />

<div
  tabindex="0"
  role="button"
  onclick={() => (mobileVisible = !mobileVisible)}
  class="border-border max-lg:bg-card shrink-0 overflow-hidden max-lg:fixed max-lg:right-2 max-lg:bottom-2 max-lg:left-2 max-lg:z-50 max-lg:cursor-pointer max-lg:rounded max-lg:border lg:w-[300px]"
>
  <!-- Actual TOC -->
  {#if !isMobile.current || (isMobile.current && mobileVisible)}
    <div
      class="relative ml-2 flex flex-col overflow-auto max-lg:max-h-[70dvh] max-lg:p-2 max-lg:pb-0 lg:pl-2"
      transition:slide={{ duration: 400 }}
    >
      <div
        class="pointer-events-none absolute left-0 mt-4 h-6 w-[2px] rounded-full bg-white lg:mt-2"
        style:top={indicatorPos.current.y * 32 + 'px'}
        style:left={indicatorPos.current.x * 16 + 'px'}
      ></div>
      <ItemsList activeSectionId={activeSectionHeading?.id ?? null} root={true} {headings} />
    </div>
  {/if}

  <!-- Mobile thingy -->
  <div
    class="border-border text-muted -mt-px hidden h-10 flex-row items-center gap-2 border-t px-2 max-lg:flex"
  >
    <!-- Progress bar -->
    <svg
      role="progressbar"
      viewBox="0 0 24 24"
      aria-valuenow={scrollPercentage / 100}
      aria-valuemin="0"
      aria-valuemax="1"
      class="text-primary size-4"
      ><circle cx="12" cy="12" r="11" fill="none" stroke-width="2" class="stroke-current/25"
      ></circle><circle
        cx="12"
        cy="12"
        r="11"
        fill="none"
        stroke-width="2"
        stroke="currentColor"
        stroke-dasharray={2 * Math.PI * 11}
        stroke-dashoffset={2 * Math.PI * 11 * (1 - scrollPercentage / 100)}
        stroke-linecap="round"
        transform="rotate(-90 12 12)"
        class="transition-all"
      ></circle></svg
    >
    <span class="text-base font-normal">{activeSectionHeading?.innerText ?? 'Loading ...'}</span>

    <ChevronUp
      class={cn(
        'ml-auto size-6 transition-transform duration-[400ms]',
        mobileVisible && 'rotate-180'
      )}
    />
  </div>
</div>
