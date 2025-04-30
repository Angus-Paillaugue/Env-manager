<script lang="ts">
  import { page } from '$app/state';
  import { pageHeading } from '$lib/stores';
  import '../app.css';
  import { dir, locale } from '$lib/translations/';
  import Navbar from './navbar.svelte';

  let { children } = $props();
  let canonical = $derived(page.url.href);

  // Change html lang and dir attributes on locale change
  $effect(() => {
    document.documentElement.lang = $locale;
    document.documentElement.dir = $dir;
  });
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

<Navbar />

{@render children?.()}
