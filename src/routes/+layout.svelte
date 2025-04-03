<script lang="ts">
  import { page } from '$app/state';
  import { pageHeading } from '$lib/stores';
  import { onMount } from 'svelte';
  import '../app.css';
  import { Button } from '$lib/components';
  import { setLocale, t } from '$lib/translations/';
  import { fly } from 'svelte/transition';

  let { children, data } = $props();
  let canonical = $derived(page.url.href);
  const { lang } = data;
  let userLanguage = $state(lang);
  let languagePopupOpen = $state(false);
  const countryFormatter = new Intl.DisplayNames([lang], { type: 'language' });

  onMount(() => {
    userLanguage = navigator.language;
    if (userLanguage) {
      userLanguage = userLanguage.split('-')[0];
    } else {
      userLanguage = lang;
    }
    if (localStorage.getItem('language-override')) {
      userLanguage = localStorage.getItem('language-override') as string;
      if (userLanguage !== lang) {
        // If the user has overridden the language and the page is not displayed in that language, we need to redirect them to the correct page
        navigateToPreferredLocale();
      }
    }
    languagePopupOpen =
      userLanguage !== lang &&
      !localStorage.getItem('language-popup-dismissed') &&
      !localStorage.getItem('language-override');
  });

  const dismissPopup = () => {
    localStorage.setItem('language-popup-dismissed', 'true');
    languagePopupOpen = false;
  };

  const navigateToPreferredLocale = () => {
    if (!userLanguage) return;
    setLocale(userLanguage);
  };
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

{#if languagePopupOpen}
  <div
    class="fixed right-2 bottom-2 z-20 max-w-[800px] max-lg:left-2 lg:right-4 lg:bottom-4 lg:w-1/2"
    transition:fly={{ y: '100%' }}
  >
    <div class="bg-card border-border flex flex-col gap-2 rounded-lg border p-4">
      <h2 class="text-lg font-bold">{$t('layout.languageSwitcher.title')}</h2>
      <p>
        {@html $t('layout.languageSwitcher.text', {
          pageLanguage: countryFormatter.of(lang),
          userLanguage: countryFormatter.of(userLanguage)
        })}
      </p>
      <div class="mt-4 flex flex-row gap-4">
        <Button onclick={navigateToPreferredLocale}>
          {$t('layout.languageSwitcher.switchToLang', { lang: countryFormatter.of(userLanguage) })}
        </Button>
        <Button variant="secondary" onclick={dismissPopup}>
          {$t('layout.languageSwitcher.dismiss')}
        </Button>
      </div>
    </div>
  </div>
{/if}
