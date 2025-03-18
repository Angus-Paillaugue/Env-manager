<script lang="ts">
	import { page } from '$app/state';
	import { Link } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { slide } from 'svelte/transition';

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

{#if $pageHeading.title !== ''}
	<header class="border-border w-full border-b px-2 py-8 lg:py-16">
		<div class="max-w-screen-bp mx-auto w-full space-y-2">
			{#if $pageHeading.breadcrumbs}
				<div class="flex flex-row items-center gap-1 text-sm">
					{#each $pageHeading.breadcrumbs as breadcrumb, i}
						{#if $pageHeading.breadcrumbs.length - 1 !== i}
							{#if breadcrumb.href}
								<Link href={breadcrumb.href} class="text-sm">{breadcrumb.title}</Link>
							{:else}
								<span class="text-sm">{breadcrumb.title}</span>
							{/if}
						{:else}
							<span class="text-muted text-sm font-normal">{breadcrumb.title}</span>
						{/if}
						{#if $pageHeading.breadcrumbs.length - 1 !== i}
							<span class="text-sm">/</span>
						{/if}
					{/each}
				</div>
			{/if}
			<h1 class="text-4xl font-medium">{$pageHeading.title}</h1>
			{#if $pageHeading.description}
				<p class="text-muted text-base font-normal" transition:slide={{ axis: 'y' }}>
					{@html $pageHeading.description}
				</p>
			{/if}
		</div>
	</header>
{/if}
