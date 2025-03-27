<script lang="ts">
	import { Button, Modal } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { Menu } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import type { Variant as ButtonVariant } from '$lib/components/Button/Button.svelte';
	import { onMount } from 'svelte';
	import { cn, isMobile } from '$lib/utils';

	$pageHeading = {
		title: 'Home',
		description: "Env manager's home page"
	};

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
	const navItems: NavItem = {
		main: [
			{ label: 'Features', href: '/features' },
			{ label: 'Docs', href: '/docs' },
			{ label: 'About', href: '/about' },
			{ label: 'Pricing', href: '/pricing' }
		],
		cta: [
			{ label: 'Login', href: '/auth/log-in', variant: 'secondary' },
			{ label: 'Sign Up', href: '/auth/sign-up', variant: 'primary' }
		]
	};

	function handleScroll(e: Event) {
		const target = e.target as HTMLElement;
		const currentScroll = target.scrollTop;

		// Check if there is enough scroll to retract navbar without causing scroll stutter
		const navHeight = 72;
		const spaceLeft = target.scrollHeight - target.clientHeight - currentScroll;
		if (spaceLeft > navHeight) {
			scrollDirection = currentScroll > previousScroll ? 'down' : 'up';
		}
		previousScroll = currentScroll;
	}

	onMount(() => {
		const main = document.querySelector('main');

		if (main) {
			main.addEventListener('scroll', handleScroll);
		}
		return () => {
			if (main) {
				main.removeEventListener('scroll', handleScroll);
			}
		};
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

<nav
	class={cn(
		'flex w-full shrink-0 flex-row items-center justify-between overflow-hidden px-2 transition-all duration-300 lg:px-4',
		!isMobile.current && scrollDirection === 'up' ? 'h-18' : 'mb-2 h-0 lg:mb-4'
	)}
>
	<div class="flex flex-row items-center justify-between gap-4 max-lg:grow">
		<a href="/">ENV-MANAGER</a>
		<Button
			class="size-10 p-2 lg:hidden"
			variant="secondary"
			onclick={() => (mobileNavOpen = !mobileNavOpen)}
		>
			<Menu class="size-full" />
		</Button>
	</div>

	<!-- Center nav -->
	<div class="hidden flex-row gap-4 lg:flex">
		{#each navItems.main as item}
			<a
				href={item.href}
				class="text-foreground after:bg-foreground relative font-mono font-bold after:absolute after:top-full after:left-1/2 after:mt-1 after:h-[2px] after:w-0 after:-translate-x-1/2 after:rounded-full after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
				>{item.label}</a
			>
		{/each}
	</div>

	<!-- CTA's -->
	<div class="hidden flex-row items-center gap-2 lg:flex">
		{#each navItems.cta as item}
			<Button href={item.href} variant={item.variant}>{item.label}</Button>
		{/each}
	</div>
</nav>
