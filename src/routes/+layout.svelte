<script lang="ts">
  import { page } from '$app/state';
  import { pageHeading } from '$lib/stores';
  import '../app.css';

  let { children } = $props();
  let canonical = $derived(page.url.pathname);
</script>

<svelte:head>
  <title>{$pageHeading?.seo?.title ?? $pageHeading.title}</title>
  <meta name="description" content={$pageHeading?.seo?.description ?? $pageHeading.description} />
  <link rel="canonical" href={canonical} />

  <!-- SEO -->
  {#if $pageHeading?.seo}
    {#if $pageHeading.seo?.title}
      <meta name="og:title" content={$pageHeading.seo.title} />
    {/if}
    {#if $pageHeading.seo?.description}
      <meta name="og:description" content={$pageHeading.seo.description} />
    {/if}
  {/if}
</svelte:head>

{@render children()}
