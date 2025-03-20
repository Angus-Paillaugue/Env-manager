<script lang="ts">
	import { Link } from '$lib/components';
	import { pageHeading } from '$lib/stores';
	import { slide } from 'svelte/transition';
</script>

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
