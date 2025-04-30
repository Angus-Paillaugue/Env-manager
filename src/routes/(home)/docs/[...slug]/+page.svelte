<script lang="ts">
  import { tocItems, type TOCEntry } from '$lib/components/docs/Toc/toc';
  import { pageHeading } from '$lib/stores';
  import { t } from '$lib/translations';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let currentPage = $derived(data.page);
  let pageContentsElement = $state<HTMLElement | null>(null);

  $effect(() => {
    pageHeading.set({
      title: $t('docs.title') + ' - ' + currentPage.metadata.name,
      description: currentPage.metadata?.description ?? ''
    });

    createTOCHierarchy();
  });

  function createTOCHierarchy() {
    const headings = pageContentsElement?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const stack: TOCEntry[] = [];
    const root: TOCEntry[] = [];

    (headings ?? []).forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));
      const item: TOCEntry = {
        id: heading.id,
        title: heading.textContent ?? '',
        children: [],
        level
      };

      while (stack.length && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length) {
        stack[stack.length - 1].children.push(item);
      } else {
        root.push(item);
      }

      stack.push(item);
    });

    tocItems.set(root);
  }
</script>

<section id="docsContainer" class="mx-auto w-full max-w-screen-xl" bind:this={pageContentsElement}>
  <!-- Need to use svelte:component instead of @render because mdsvex can break the page on the initial server load -->
  <!-- Until this is fixed, we are stick with that -->
  <!-- svelte-ignore svelte_component_deprecated -->
  <svelte:component this={currentPage.component} />
</section>
