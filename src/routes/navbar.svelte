<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import { Button, Modal } from '$lib/components';
  import type { Variant as ButtonVariant } from '$lib/components/Button/Button.svelte';
  import { t } from '$lib/translations';
  import { Menu } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { fly, slide } from 'svelte/transition';

  let mobileNavOpen = $state(false);
  let scrollDirection = $state<'up' | 'down'>('up');
  let previousScroll = $state(0);

  interface NavItem {
    main: {
      label: string;
      href: string;
    }[];
    cta: {
      label: string;
      href: string;
      variant: ButtonVariant;
    }[];
  }
  let navItems: NavItem = $derived({
    main: [
      { label: 'home.navbar.navItems.main.features', href: '/#features' },
      { label: 'home.navbar.navItems.main.docs', href: '/docs' },
      { label: 'home.navbar.navItems.main.pricing', href: '/pricing' }
    ],
    cta: page.data?.user
      ? [{ label: 'home.navbar.navItems.cta.dashboard', href: '/app', variant: 'primary' }]
      : [
          { label: 'home.navbar.navItems.cta.logIn', href: '/auth/log-in', variant: 'secondary' },
          { label: 'home.navbar.navItems.cta.signUp', href: '/auth/sign-up', variant: 'primary' }
        ]
  });

  function handleScroll(e: Event) {
    const target = e.target as Document;
    const currentScroll = target.documentElement.scrollTop || target.body.scrollTop;

    scrollDirection = currentScroll > previousScroll ? 'down' : 'up';
    previousScroll = currentScroll;
  }

  onMount(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  afterNavigate(() => {
    mobileNavOpen = false;
  });
</script>

<Modal.Backdrop bind:open={mobileNavOpen} />

{#if mobileNavOpen}
  <div
    class="bg-card border-border fixed top-0 right-0 left-0 z-40 flex h-fit flex-col gap-8 rounded-b-lg border-b p-4"
    transition:slide={{ axis: 'y', duration: 400 }}
  >
    <div class="flex flex-col gap-4">
      {#each navItems.main as item}
        <a href={item.href} class="text-center text-base">{$t(item.label)}</a>
      {/each}
    </div>

    <div class="flex flex-row gap-4">
      {#each navItems.cta as item}
        <Button href={item.href} variant={item.variant} class="w-full">{$t(item.label)}</Button>
      {/each}
    </div>
  </div>
{/if}

{#if scrollDirection === 'up'}
<div
  class='flex w-full fixed top-0 left-0 right-0 p-2 transition-all duration-300 h-fit z-20'
  transition:fly={{ y: '-100%', duration: 400 }}
>
  <nav
    class="border-border bg-card flex w-full shrink-0 flex-row items-center justify-between overflow-hidden rounded-lg border p-2 transition-all duration-300 lg:p-3"
  >
    <div class="flex flex-row items-center justify-between gap-4 max-lg:grow">
      <a href="/">{$t('home.navbar.projectName')}</a>
      <Button
        class="size-10 p-2 lg:hidden"
        variant="secondary"
        onclick={() => (mobileNavOpen = !mobileNavOpen)}
      >
        <Menu class="size-full" />
      </Button>
    </div>

    <!-- Center nav -->
    <div class="hidden flex-row items-center justify-center gap-4 lg:flex">
      {#each navItems.main as item}
        <a
          href={item.href}
          class="text-foreground after:bg-foreground relative font-mono font-bold after:absolute after:top-full after:left-1/2 after:mt-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
          >{$t(item.label)}</a
        >
      {/each}
    </div>

    <!-- CTA's -->
    {#if page.data.IS_PUBLIC_WEBSITE}
      <!-- If is the demo website (public facing), do not show CTA's -->
      <div class="h-10"></div>
    {:else}
      <div class="hidden flex-row items-center gap-2 lg:flex">
        {#each navItems.cta as item}
        <Button href={item.href} variant={item.variant}>{$t(item.label)}</Button>
        {/each}
      </div>
    {/if}
  </nav>
</div>
{/if}
