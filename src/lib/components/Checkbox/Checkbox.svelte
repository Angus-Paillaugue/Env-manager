<script lang="ts">
	import type { RequiredFields } from '$lib/types';
	import { cn } from '$lib/utils';
	import { Check } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { scale } from 'svelte/transition';

	interface MyProps {
		inverted?: boolean;
	}

	let {
		checked = $bindable(),
		id,
		class: className,
		inverted = false,
		...restProps
	}: RequiredFields<SvelteHTMLElements['input'] & MyProps, 'id'> = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	const classes = cn(
		'peer size-5 cursor-pointer appearance-none rounded-sm transition-all disabled:opacity-70',
		inverted
			? 'checked:bg-card-foreground bg-primary-foreground'
			: 'checked:bg-primary bg-card-foreground',
		className
	);
</script>

<!-- No fucking idea why, but on mount, the checked value is randomly toggled -->
<!-- So, wrapping it into a non SSR component seems to fix it. -->
<!-- Will need to investigate more thoroughly when I have time -->
{#if mounted}
	<label class="relative inline-flex cursor-pointer items-center" for={id}>
		<input {id} type="checkbox" class={classes} bind:checked {...restProps} />
		{#if checked}
			<span
				class="text-foreground pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform peer-disabled:opacity-70"
				transition:scale={{ duration: 150 }}
			>
				<Check class="size-3.5" strokeWidth={3} />
			</span>
		{/if}
	</label>
{:else}
	<div
		class={cn(
			'size-5 animate-pulse rounded-sm',
			inverted ? 'bg-primary-foreground' : 'bg-card-foreground',
			className
		)}
	></div>
{/if}
