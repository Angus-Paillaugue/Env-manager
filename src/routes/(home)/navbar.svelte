<script lang="ts">
	import { Button, Modal } from "$lib/components";
	import { pageHeading } from "$lib/stores";
	import { Menu } from "lucide-svelte";
	import { slide } from "svelte/transition";
  import type { Variant as ButtonVariant } from '$lib/components/Button/Button.svelte';

  $pageHeading = {
    title: 'Home',
    description: 'Env manager\'s home page',
  }

  let mobileNavOpen = $state(false);

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
  const navItems: NavItem = {
    main: [
      { label: 'Features', href: '/features' },
      { label: 'Docs', href: '/docs' },
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
    ],
    cta: [
      { label: 'Login', href: '/auth/log-in', variant: 'secondary' },
      { label: 'Sign Up', href: '/auth/sign-up', variant: 'primary' },
    ],
  }
</script>

<Modal.Backdrop bind:open={mobileNavOpen} />

{#if mobileNavOpen}
  <div class="fixed top-0 left-0 right-0 p-4 h-fit rounded-b-lg flex flex-col gap-8 z-40 bg-card border-b border-border" transition:slide={{ axis:'y', duration: 400 }}>
    <div class="flex flex-col gap-4">
      {#each navItems.main as item}
        <a href={item.href} class="text-center text-base">{item.label}</a>
      {/each}
    </div>

    <div class="flex flex-row gap-4">
      {#each navItems.cta as item}
        <Button href={item.href} variant={item.variant} class="w-full">{item.label}</Button>
      {/each}
    </div>
  </div>
{/if}

<nav class="flex flex-row items-center justify-between shrink-0 w-full px-2 lg:px-4 h-18">
  <div class="flex flex-row justify-between max-lg:grow gap-4 items-center">
    <a href="/">ENV-MANAGER</a>
    <Button
      class="lg:hidden p-2 size-10"
      variant="secondary"
      onclick={() => mobileNavOpen = !mobileNavOpen}
    >
      <Menu class="size-full" />
    </Button>
  </div>

  <!-- Center nav -->
  <div class="hidden lg:flex flex-row gap-4">
    {#each navItems.main as item}
      <a href={item.href} class="font-mono text-foreground font-bold relative after:absolute after:content-[''] after:top-full after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:mt-1 after:rounded-full after:bg-foreground after:transition-all after:duration-300 hover:after:w-full">{item.label}</a>
    {/each}
  </div>

  <!-- CTA's -->
  <div class="hidden lg:flex flex-row gap-2 items-center">
    {#each navItems.cta as item}
      <Button href={item.href} variant={item.variant}>{item.label}</Button>
    {/each}
  </div>
</nav>
