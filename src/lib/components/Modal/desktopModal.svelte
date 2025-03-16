<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import Backdrop from './Backdrop.svelte';
	import { fly } from 'svelte/transition';
	import { TRANSITION_DURATION } from '.';
	import { cn } from '$lib/utils';
	import { backInOut } from 'svelte/easing';

	interface MyProps {
		open: boolean;
		onClose?: () => void;
	}

	let {
		open = $bindable(false),
		onClose,
		children
	}: SvelteHTMLElements['div'] & MyProps = $props();

	$effect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
			if (onClose) onClose();
		}
	});
</script>

<Backdrop bind:open />

{#if open}
	<div class="pointer-events-none fixed inset-2 z-50 flex items-center justify-center">
		<div
			class={cn(
				'bg-card text-foreground border-border pointer-events-auto flex max-h-full w-full max-w-screen-sm flex-col rounded border p-4'
			)}
			transition:fly={{ y: '100', duration: TRANSITION_DURATION, easing: backInOut }}
		>
			{@render children?.()}
		</div>
	</div>
{/if}
