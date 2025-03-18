<script lang="ts">
	import { fade } from 'svelte/transition';
	import { TRANSITION_DURATION } from '.';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { cn } from '$lib/utils';

	interface MyProps {
		open: boolean;
		duration?: number;
	}
	let {
		open = $bindable(false),
		duration = TRANSITION_DURATION,
		class: className,
		...restProps
	}: SvelteHTMLElements['div'] & MyProps = $props();

	function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			open = false;
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeyDown} />

{#if open}
	<!-- Backdrop -->
	<div
		aria-label="Close sidebar"
		class={cn('bg-background/50 fixed inset-0 z-40 backdrop-blur-xs', className)}
		onclick={() => (open = false)}
		transition:fade={{ duration }}
		aria-hidden="true"
		role="button"
		tabindex="0"
		{...restProps}
	></div>
{/if}
